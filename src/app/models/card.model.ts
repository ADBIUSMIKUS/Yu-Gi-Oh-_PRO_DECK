export interface CardImage {
  id: number;
  image_url: string;
  image_url_small: string;
}

export interface CardSet {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_price: string;
}

export interface YugiohCard {
  id: number;
  name: string;
  type: string;
  desc: string;
  atk?: number | null;
  def?: number | null;
  level?: number | null;
  attribute?: string;
  archetype?: string;
  card_images?: CardImage[];
  card_sets?: CardSet[];
}

export interface CardInfoResponse {
  data: YugiohCard[];
}
