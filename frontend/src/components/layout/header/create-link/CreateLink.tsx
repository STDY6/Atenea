import { buttonStyles } from '@gear-js/ui';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

type ClassNameProps = {
  isActive: boolean;
};

function CreateLink() {
  const getClassName = ({ isActive }: ClassNameProps) =>
    clsx(buttonStyles.button, buttonStyles.small, isActive ? buttonStyles.secondary : buttonStyles.primary);

  return (
    <h1 >
      A T E N E A 
    </h1>
  );
}

export { CreateLink };
