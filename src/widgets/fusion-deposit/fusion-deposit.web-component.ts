import { createElement, type ReactElement } from 'react';
import type { Address } from 'viem';
import { createRoot, type Root } from 'react-dom/client';
import { FusionDepositWidget } from './fusion-deposit.widget';
import type { AppConfig } from '@/app/config/config.context';
import { type ChainId } from '@/app/config/wagmi';
import globalStyles from '@/index.css?inline';

const OUTPUT_FILE_NAME = import.meta.env.VITE_OUTPUT_FILE_NAME;

export class FusionDepositWebComponent extends HTMLElement {
  private root: Root;
  private address: Address | undefined = undefined;
  private chainId: ChainId | undefined = undefined;
  private config: AppConfig;

  constructor() {
    super();
    this.config = {
      provider: undefined,
      onError: undefined,
      connect: undefined,
    };
    const shadow = this.attachShadow({ mode: 'open' });
    this.root = createRoot(shadow);
    this.applyStyles();
  }

  static get observedAttributes(): string[] {
    return ['data-address', 'data-chain-id'];
  }

  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    if (name === 'data-address') {
      this.address = newValue as Address;
    }
    if (name === 'data-chain-id') {
      this.chainId = parseInt(newValue) as ChainId;
    }
    this.render();
  }

  update(config: Partial<AppConfig>) {
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
        chainId: this.chainId,
        fusionVaultAddress: this.address,
        ...this.config,
      }
    );
    this.root.render(element);
  }

  private async applyStyles() {
    if (!this.shadowRoot) {
      throw new Error('Shadow root not found');
    };

    const componentStyles = await fetch(`/${OUTPUT_FILE_NAME}.css`)
      .then(res => res.text());

    const styles = globalStyles.concat(componentStyles);

    try {
      if ('adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype) {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(styles);
        this.shadowRoot.adoptedStyleSheets = [
          ...this.shadowRoot.adoptedStyleSheets,
          sheet,
        ];
      } else {
        this.legacyApplyStyles(styles);
      }
    } catch {
      this.legacyApplyStyles(styles);
    }
  }

  private legacyApplyStyles(styles: string) {
    if (!this.shadowRoot) {
      throw new Error('Shadow root not found');
    };

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    this.shadowRoot.appendChild(styleEl);
  }
};



