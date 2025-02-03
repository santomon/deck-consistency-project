import { z } from "zod";

export enum FrameType {
  NORMAL = "normal",
  EFFECT = "effect",
  SPELL = "spell",
  TRAP = "trap",
  EFFECT_PENDULUM = "effect_pendulum",
  NORMAL_PENDULUM = "normal_pendulum",
  LINK = "link",
  SYNCHRO = "synchro",
  XYZ = "xyz",
  FUSION = "fusion",
  RITUAL = "ritual",
  DEFAULT = "default",
  //...
}

export enum Tab {
  GROUPS = "groups",
  COMBOS = "combos",
  HAND_CONDITIONS = "handConditions",
  SIMULATION = "simulation",
}

const IdSchema = z.number();
export type CardId = z.infer<typeof IdSchema>;
export type ComboId = z.infer<typeof IdSchema>;
export type GroupId = z.infer<typeof IdSchema>;

// CardSet schema
// define the structure of the card sets
const CardSetSchema = z.object({
  set_name: z.string(),
  set_code: z.string(),
  set_rarity: z.string(),
  set_rarity_code: z.string(),
  set_price: z.string(),
});

// CardImage schema
// defines the structure of the card images
const CardImageSchema = z.object({
  id: z.number(),
  image_url: z.string().url(),
  image_url_small: z.string().url(),
  image_url_cropped: z.string().url(),
});

// CardPrice schema
// defines the structure of the card prices
const CardPriceSchema = z.object({
  cardmarket_price: z.string(),
  tcgplayer_price: z.string(),
  ebay_price: z.string(),
  amazon_price: z.string(),
  coolstuffinc_price: z.string(),
});

// BanlistInfo schema
// defines the structure of the banlist information
const BanlistInfoSchema = z.object({
  ban_ocg: z.string().optional(),
});

// CardInfo schema
// defines the main structure of the card information
const CardInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  typeline: z.array(z.string()).optional(),
  type: z.string(),
  humanReadableCardType: z.string(),
  frameType: z.nativeEnum(FrameType),
  desc: z.string(),
  race: z.string().optional(),
  atk: z.number().optional(),
  def: z.number().optional(),
  level: z.number().optional(),
  attribute: z.string().optional(),
  archetype: z.string().optional(),
  ygoprodeck_url: z.string().url(),
  card_sets: z.array(CardSetSchema),
  banlist_info: BanlistInfoSchema.optional(),
  card_images: z.array(CardImageSchema),
  card_prices: z.array(CardPriceSchema),
});

const CardGroupSchema = z.object({
  id: z.number(),
  name: z.string(),
  cards: z.string().array(),
});
type CardGroup = z.infer<typeof CardGroupSchema>;

// Main data schema
// defines the structure of the entire dataset
const YGOCardInfoResponseSchema = z.object({
  data: z.array(CardInfoSchema),
});

// Example: Infer TypeScript types from the schema
type CardInfo = z.infer<typeof CardInfoSchema>;
type YGOCardInfoResponse = z.infer<typeof YGOCardInfoResponseSchema>;
export type { CardInfo, CardGroup, YGOCardInfoResponse };

export { CardInfoSchema, YGOCardInfoResponseSchema, CardGroupSchema };
export type HandConditionWhere = "include" | "exclude";

export const ComboPieceSchema = z.object({
  foreignId: z.union([IdSchema, z.string()]),
  type: z.enum(["card", "group"]),
});
export type ComboPiece = z.infer<typeof ComboPieceSchema>;

export const ComboSchema = z.object({
  id: IdSchema,
  comboPieces: ComboPieceSchema.array(),
  numberRequired: z.number(),
  name: z.string(),
});
export type Combo = z.infer<typeof ComboSchema>;

export const ConditionSchema = z.object({
  foreignId: z.union([IdSchema, z.string()]),
  type: z.enum(["card", "group", "combo"]),
});
export type Condition = z.infer<typeof ConditionSchema>;

export const HandConditionSchema = z.object({
  id: IdSchema,
  name: z.string(),
  shouldIncludeAtLeastOneOf: ConditionSchema.array(),
  mustNotInclude: ConditionSchema.array(),
});
export type HandCondition = z.infer<typeof HandConditionSchema>;

export interface CardEnvironment {
  cardGroups: CardGroup[];
  combos: Combo[];
}

export const DeckDataSchema = z.object({
  mainDeck: IdSchema.array(),
  groups: CardGroupSchema.array(),
  combos: ComboSchema.array(),
  handConditions: HandConditionSchema.array(),
});
export type DeckData = z.infer<typeof DeckDataSchema>;

export const TotalStoreSchema = z.object({
  data: DeckDataSchema,
  name: z.string(),
  saveTimeStamp: z.string().datetime(),
});
export type TotalStore = z.infer<typeof TotalStoreSchema>;
