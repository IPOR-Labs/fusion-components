import './index.css'

import { FusionDepositElement } from './widgets/fusion-deposit/fusion-deposit.element';

const tagName = 'fusion-deposit';

if (!customElements.get(tagName)) {
  customElements.define(tagName, FusionDepositElement);
}
