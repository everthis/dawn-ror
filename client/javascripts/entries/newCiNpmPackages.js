import styles from '../../stylesheets/newCiNpmPackages.scss';
import {newCiPackages as ncnp} from '../modules/newCiPackages';
(function() {
  let A = window.A || {};
  window.A = A;
  A.ncnp = ncnp;
})();
