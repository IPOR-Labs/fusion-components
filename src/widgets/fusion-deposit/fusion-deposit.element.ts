import { createElement, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { FusionDepositWidget } from './fusion-deposit.widget';
import type { FusionDepositConfig } from './fusion-deposit.types';

export class FusionDepositElement extends HTMLElement {
  private root: Root | null = null;
  private mountTarget: ShadowRoot | HTMLElement | null = null;
  private mutationObserver: MutationObserver | null = null;

  connectedCallback(): void {
    console.log('connectedCallback');
    if (!this.mountTarget) {
      this.mountTarget = this.attachShadow({ mode: 'open' });
    }
    if (!this.mutationObserver) {
      this.mutationObserver = new MutationObserver((mutations) => {
        const hasAttributeChange = mutations.some((m) => m.type === 'attributes');
        if (hasAttributeChange) this.renderReact();
      });
      this.mutationObserver.observe(this, { attributes: true });
    }
    this.renderReact();
  }

  attributeChangedCallback(): void {
    console.log('attributeChangedCallback');
    this.renderReact();
  }

  disconnectedCallback(): void {
    console.log('disconnectedCallback');
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  static get observedAttributes(): string[] {
    console.log('observedAttributes');
    // Observe all attributes to keep props in sync
    return [];
  }

  update(config: Partial<FusionDepositConfig>) {
    console.log({ config });
  }

  destroy() {
    console.log('destroy');
  }

  private renderReact(): void {
    if (!this.mountTarget) return;
    if (!this.root) {
      this.root = createRoot(this.mountTarget);
    }
    const element: ReactElement = createElement(FusionDepositWidget, {
      config: {
        // walletClient: null,
      }
    });
    this.root.render(element);
  }
};



