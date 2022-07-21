export interface CanisterConfig {
  category: string;
  package: string;
  bin_name: string;
  config: string;
  private?: string;
  public?: string;
  url?: string;
  no_deploy?: boolean;
}
export type Canisters = Array<CanisterConfig>;

export const config = <Canisters>[
  {
    category: 'canisters',
    package: 'foxic_wallet',
    bin_name: 'foxic_wallet',
    config: './configs/foxic_wallet.json',
    no_deploy: false,
  },
  {
    category: 'canisters',
    package: 'foxic_factory',
    bin_name: 'foxic_factory',
    config: './configs/foxic_factory.json',
    no_deploy: true,
  },
];
