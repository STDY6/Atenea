import { Link } from 'react-router-dom';
import { ReactComponent as SVG } from 'assets/images/logo.svg';
// importing the image from assets/images/icons/logo.jpg
import logo from 'assets/images/icons/logo.jpg';

function Logo() {
  return (
    <Link to="/create">
      <img src={logo} className='logo' alt="logo" style={{width : '100px', borderRadius:'50%'}} />
    </Link>
  );
}

export { Logo };
