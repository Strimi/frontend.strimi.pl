export class Constants {


  public static readonly STORAGE_STRIMI = 'strimi';
  public static readonly STORAGE_KEY_POST_LANG = 'post_lang';
  public static readonly STORAGE_KEY_LANG = 'lang';

  public static readonly STRIMI_TAG = 'strimi';
  public static readonly STRIMI_TAG_PL = 'strimi-pl';
  public static readonly NSFW_TAG = 'nsfw';


  public static readonly PL_LANG = 'pl';
  public static readonly EN_LANG = 'en';
  public static readonly KO_LANG = 'ko';

  public static readonly STRIMI = 'strimi';
  public static readonly STRIMI_STREAM = 'strimi-stream';
  public static readonly STRIMI_20 = 'strimi/2.0';
  public static readonly STRIMI_PREFIX = 'strimi-';

  // some other public API
  public static readonly APP_STEEMIT = 'steemit';
  public static readonly APP_DTUBE = 'dtube';
  public static readonly APP_BUSSY = 'busy';

  public static readonly APP_STRIMI_URL = 'strimi.it';
  public static readonly APP_STEEMIT_URL = 'steemit.com';
  public static readonly APP_DTUBE_URL = 'd.tube';
  public static readonly APP_BUSSY_URL = 'busy.org';

  // used to filter rewards from steem
  public static readonly AUTHOR_REWARD = 'author_reward';
  public static readonly CURATION_REWARD = 'curation_reward';
  public static readonly TRANSFER = 'transfer';
  public static readonly CLAIM_REWARD_BALANCE = 'claim_reward_balance';
  public static readonly FILL_ORDER = 'fill_order';
  public static readonly DELEGATE_VESTING_SHARES = 'delegate_vesting_shares';
  public static readonly ACCOUNT_CREATEA_WITH_DELEGATION = 'account_create_with_delegation';
  public static readonly TRANSFER_TO_VESTING = 'transfer_to_vesting';
  public static readonly RETURN_VESTING_DELEGATION = 'return_vesting_delegation';

  public static readonly SORT_BEST = 'best';
  public static readonly SORT_DESC = 'desc';
  public static readonly SORT_ASC = 'asc';

  public static readonly THEME_DARK = 'night';

  // api filter posts
  public static readonly POPULAR = 'popular';
  public static readonly DISCUSSED = 'discussed';


  public static readonly THREE_H = '3';
  public static readonly SIX_H = '6';
  public static readonly TWELVE_H = '12';
  public static readonly TWENTY_FOUR_H = '24';

  public static readonly BENEFICIARIES = [
    [0, {
      beneficiaries: [
        { account: 'strimi', weight: 1500 } // (500 = 15%)
      ]
    }]
  ];

}
