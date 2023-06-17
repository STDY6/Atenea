import { Button, Checkbox, FileInput, Input, Textarea } from '@gear-js/ui';
import { useForm, useFieldArray, set } from 'react-hook-form';
import { useEffect, useState} from 'react';
import { useApi, useAccount, useAlert } from '@gear-js/react-hooks';
import { Routing } from 'pages';
import { Header, ApiLoader } from 'components';
import { withProviders } from 'hocs';
import 'App.scss';
import { articles, Article } from './articles';
import { CreateForm } from './CreateForm';
import clsx from 'clsx';
import plus from 'assets/images/form/plus.svg';
import { useIPFS, useSendNFTMessage } from 'hooks';
import { getMintDetails, getMintPayload } from 'utils';
import { Attributes } from './attributes';
import styles from './Create.module.scss';
import { log } from 'console';

/* --------------------------------------- */

/* lista con url de imagenes de ciencia */
const science = [
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
  'https://cdn.pixabay.com/photo/2020/03/16/16/29/virus-4937553_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/11/03/11/57/accountant-1794122_1280.png',
  'https://cdn.pixabay.com/photo/2020/03/16/16/29/virus-4937553_1280.jpg',
  'https://cdn.pixabay.com/photo/2016/11/03/11/57/accountant-1794122_1280.png',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
  'https://cdn.pixabay.com/photo/2016/11/03/11/57/accountant-1794122_1280.png',
  'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg',
  'https://cdn.pixabay.com/photo/2020/03/16/16/29/virus-4937553_1280.jpg',
];


type AttributesValue = { key: string; value: string };
type Values = { name: string; description: string; file: FileList; attributes: AttributesValue[]; rarity: string };

const defaultAttributes = [{ key: '', value: '' }];
const defaultValues = { name: '', description: '', attributes: defaultAttributes, rarity: '' };

const FILE_FILE_TYPES = ['image/png', 'image/gif', 'image/jpeg'];


/* --------------------------------------- */
function Create() {
  const { isApiReady } = useApi();
  const { isAccountReady } = useAccount();

  /* --------------------------------------- */
  const { formState, control, register, handleSubmit, resetField, reset } = useForm<Values>({ defaultValues });
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' });
  const { errors } = formState;

  const alert = useAlert();
  const ipfs = useIPFS();
  const sendMessage = useSendNFTMessage();

  const [isAnyAttribute, setIsAnyAttribute] = useState(false);
  const [isRarity, setIsRarity] = useState(false);

  const toggleAttributes = () => setIsAnyAttribute((prevValue) => !prevValue);
  const toggleRarity = () => setIsRarity((prevValue) => !prevValue);

  const [purchase, setPurchase] = useState(false);

  useEffect(() => {
    resetField('attributes');
  }, [isAnyAttribute, resetField]);

  useEffect(() => {
    resetField('rarity');
  }, [isRarity, resetField]);

  const triggerImageChange = () => {
    // hacky fix cuz reset() doesn't trigger file input's onChange
    const changeEvent = new Event('change', { bubbles: true });
    document.querySelector('[name="image"]')?.dispatchEvent(changeEvent);
  };

  /* this is a hacky fix cuz reset() doesn't trigger file input's onChange */
  const resetForm = () => {
    reset();
    triggerImageChange();
    setIsAnyAttribute(false);
    setIsRarity(false);
  };

  /* onSubmit */
  const onSubmit = async (data: Values) => {
    const { name, description, attributes, rarity } = data;
    const file = data.file[0];
    setPurchase(false);
    console.log('file: ', file);

    const details = isAnyAttribute || isRarity ? getMintDetails(isAnyAttribute ? attributes : undefined, rarity) : '';

    ipfs
      .add(file)
      .then(({ cid }) => cid)
      .then(async (fileCid) => (details ? { detailsCid: (await ipfs.add(details)).cid, fileCid } : { fileCid }))
      .then(({ fileCid, detailsCid }) => getMintPayload(name, description, fileCid, detailsCid))
      .then((payload) => sendMessage(payload, { onSuccess: resetForm }))
      .catch(({ message }: Error) => alert.error(message));
  };

  /* states with name1 and description2, name2 and description 3, ... to name8 */
  const [name1, setName1] = useState('FIRST BOOK');
  const [description1, setDescription1] = useState('This is a book about Animals');
  const [name2, setName2] = useState('SECOND ARTICLE');
  const [description2, setDescription2] = useState('This is a article about viruses');
  const [name3, setName3] = useState('THIRD ARTICLE');
  const [description3, setDescription3] = useState('This is a article about Genetics');
  const [name4, setName4] = useState('FOURTH ARTICLE');
  const [description4, setDescription4] = useState('Ths is a article about artificial intelligence');

  

  return (
    <>
      {/* <Header isAccountVisible={isAccountReady} /> */}
      {/* <main>{isApiReady && isAccountReady ? <Routing /> : <ApiLoader />}</main> */}
      <div className="container">
        {articles.map((article: Article, index: number) => (
          <div className="articles-container">
            <div className="card">
              {/* <CreateForm name={article.name} description={article.description} /> */}
              <h2>
                {article.name}
              </h2>
              <img src={science[index]} alt="science" />
              <p>{article.description}</p>
              <br />
              <button  onClick={() => setPurchase(!purchase)} >purchase</button>
            </div>
          </div>
        ))}
      </div>
      {purchase && (
        
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <h2>CHOOSE WHERE DO YOU WANT TO SAVE IT</h2>
        <div style={{display:'none'}} className={styles.item}>
          <Input
          hidden label="Name" className={styles.input} value={name1} />
          <p className={styles.error}>{errors.name?.message}</p>
        </div>

        <div
        style={{display:'none'}}
         className={styles.item}>
          <Textarea
          hidden
            label="Description"
            className={styles.input}
            value={description1}
          />
          <p className={styles.error}>{errors.description?.message}</p>
        </div>

        <div
        style={{display:'none'}}
         className={clsx(styles.input, styles.checkboxWrapper)}>
          <div className={styles.item}>
            <Checkbox hidden label="Attributes" checked={isAnyAttribute} onChange={toggleAttributes} />
            {isAnyAttribute && <Button icon={plus} color="transparent" onClick={() => append(defaultAttributes)} />}
            <p className={clsx(styles.error, styles.checkboxError)}>
              {(errors.attributes?.[0]?.key || errors.attributes?.[0]?.value) && 'Enter attributes'}
            </p>
          </div>
        </div>
        {isAnyAttribute && <Attributes register={register} fields={fields} onRemoveButtonClick={remove} />}

        <div className={clsx(styles.input, styles.checkboxWrapper)}>
          <div style={{display:'none'}} className={styles.item}>
            <Checkbox hidden label="Rarity" checked={isRarity} onChange={toggleRarity} />
            <p className={clsx(styles.error, styles.checkboxError)}>{errors.rarity?.message}</p>
          </div>
        </div>
        {isRarity && (
          <div style={{display:'none'}} className={styles.item}>
            <Input hidden  className={styles.input} />
          </div>
        )}

        <div className={styles.item}>
          <FileInput
            label="choose"
            className={styles.input}
            {...register('file', {
            }
            )}
            
          />
          <p className={styles.error}>{errors.file?.message}</p>
        </div>
        <Button type="submit" text="Create" className={styles.button} block />
      </form>
      )}
    </>
  );
}

export { Create };
