import { createElement, type ReactElement } from 'react';
import type { Address } from 'viem';
import { createRoot, type Root } from 'react-dom/client';
import { FusionDepositWidget } from './fusion-deposit.widget';
import type { FusionDepositConfig } from './fusion-deposit.types';
import type { ChainId } from '@/app/wagmi';

import styles from '@/index.css?inline';

export class FusionDepositWebComponent extends HTMLElement {
  private root: Root;
  private config: FusionDepositConfig;
  private address: Address | undefined = undefined;
  private chainId: ChainId | undefined = undefined;

  constructor() {
    super();
    this.config = {
      walletClient: undefined,
      onError: undefined,
      connect: undefined,
    };
    const shadow = this.attachShadow({ mode: 'open' });
    this.root = createRoot(shadow);
    this.applyStyles();
    this.render();
  }

  static get observedAttributes(): string[] {
    return ['address', 'chain-id'];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'address') {
      this.address = newValue as Address;
    }
    if (name === 'chain-id') {
      this.chainId = parseInt(newValue) as ChainId;
    }
    this.render();
  }

  update(config: Partial<FusionDepositConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
    this.render();
  }

  private render() {
    if (!this.chainId) return;
    if (!this.address) return;
    const element: ReactElement = createElement(
      FusionDepositWidget,
      {
        ...this.config,
        chainId: this.chainId,
        address: this.address,
      }
    );
    this.root.render(element);
  }

  private applyStyles() {
		try {
      if (!this.shadowRoot) {
        throw new Error('Shadow root not found');
      };
			if ('adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype) {
				const sheet = new CSSStyleSheet();
				sheet.replaceSync(styles);
				this.shadowRoot.adoptedStyleSheets = [
          ...this.shadowRoot.adoptedStyleSheets, 
          sheet,
        ];
			} else {
				this.legacyApplyStyles();
			}
		} catch {
			this.legacyApplyStyles();
		}
  }

  private legacyApplyStyles() {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    this.shadowRoot?.appendChild(styleEl);
  }
};



