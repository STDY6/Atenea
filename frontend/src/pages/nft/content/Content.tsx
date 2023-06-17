/* este es el componente que se encarga de mostrar la informacion de cada token, como el nombre, la imagen, el dueño, la descripcion, la rareza, los atributos, etc. */
import { HexString } from '@polkadot/util/types';
import { useAccount } from '@gear-js/react-hooks';
import { Button } from '@gear-js/ui';
import clsx from 'clsx';
import { Addresses } from '../addresses';
import { Attributes } from '../attributes';
import { Card } from '../card';
import styles from './Content.module.scss';

type Props = {
  heading: string;
  image: string;
  ownerId: HexString;
  description: string;
  approvedAccounts: HexString[];
  rarity?: string;
  attributes?: { [key: string]: string };
  onTransferButtonClick: () => void;
  onApproveButtonClick: () => void;
  onRevokeButtonClick: (address: HexString) => void;
};

function Content(props: Props) {
  const {
    heading,
    image,
    ownerId,
    description,
    approvedAccounts,
    rarity,
    attributes,
    onTransferButtonClick,
    onApproveButtonClick,
    onRevokeButtonClick,
  } = props;

  const { account } = useAccount();
  const isOwner = account?.decodedAddress === ownerId;
  const isAnyApprovedAccount = !!approvedAccounts.length;

  const detailsClassName = clsx(styles.main, styles.details);

  return (
    <>
      <h2 className={styles.heading}>{heading}</h2>
      <div className={styles.main}>
        INFORMACIÓN DEL TOKEN
        <section>
          <div className={styles.imgCard}>
            <img src={image} alt="" className={styles.image} />
          </div>
          {isOwner && (
            <div className={styles.buttons}>
              <Button text="Transfer" color="secondary" onClick={onTransferButtonClick} block />
              <Button text="Approve" onClick={onApproveButtonClick} block />
            </div>
          )}
        </section>
        <section>
          <div className={detailsClassName}>
            <Card heading="Owner" text={ownerId} />
            {rarity && <Card heading="Rarity" text={rarity} />}
            <Card heading="Description" text={description} />
            {attributes && <Attributes attributes={attributes} />}
          </div>
          {isAnyApprovedAccount && (
            <Addresses list={approvedAccounts} onAddressClick={onRevokeButtonClick} isOwner={isOwner} />
          )}
        </section>
      </div>
    </>
  );
}

export { Content };
