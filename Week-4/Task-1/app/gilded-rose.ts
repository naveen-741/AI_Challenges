/**
 * Constants for item names and quality limits
 */
const ITEM_NAMES = {
  AGED_BRIE: "Aged Brie",
  BACKSTAGE_PASS: "Backstage passes to a TAFKAL80ETC concert",
  SULFURAS: "Sulfuras, Hand of Ragnaros",
} as const;

const QUALITY_LIMITS = {
  MIN: 0,
  MAX: 50,
  LEGENDARY: 80,
} as const;

const BACKSTAGE_THRESHOLDS = {
  FIRST_BOOST: 10,
  SECOND_BOOST: 5,
  CONCERT_DAY: 0,
} as const;

/**
 * Represents an item in the Gilded Rose inventory system.
 */
export class Item {
  constructor(
    public readonly name: string,
    public sellIn: number,
    public quality: number
  ) {
    this.validateQuality(quality);
  }

  private validateQuality(quality: number): void {
    if (quality < QUALITY_LIMITS.MIN) {
      throw new Error(`Quality cannot be negative: ${quality}`);
    }
    if (
      this.name === ITEM_NAMES.SULFURAS &&
      quality !== QUALITY_LIMITS.LEGENDARY
    ) {
      throw new Error(
        `Sulfuras must have quality of ${QUALITY_LIMITS.LEGENDARY}`
      );
    }
    if (this.name !== ITEM_NAMES.SULFURAS && quality > QUALITY_LIMITS.MAX) {
      throw new Error(
        `Quality cannot exceed ${QUALITY_LIMITS.MAX}: ${quality}`
      );
    }
  }
}

/**
 * Base class for items that can be updated in the Gilded Rose system.
 */
abstract class UpdatableItem extends Item {
  protected increaseQuality(amount = 1): void {
    if (this.name === ITEM_NAMES.SULFURAS) return;
    this.quality = Math.min(QUALITY_LIMITS.MAX, this.quality + amount);
  }

  protected decreaseQuality(amount = 1): void {
    if (this.name === ITEM_NAMES.SULFURAS) return;
    this.quality = Math.max(QUALITY_LIMITS.MIN, this.quality - amount);
  }

  protected updateSellIn(): void {
    if (this.name !== ITEM_NAMES.SULFURAS) {
      this.sellIn--;
    }
  }

  abstract update(): void;
}

/**
 * Represents a normal item that degrades in quality over time.
 */
class NormalItem extends UpdatableItem {
  update(): void {
    this.decreaseQuality();
    this.updateSellIn();
    if (this.sellIn < 0) {
      this.decreaseQuality(); // Degrades twice as fast after sell-by date
    }
  }
}

/**
 * Represents Aged Brie, which increases in quality over time.
 */
class AgedBrie extends UpdatableItem {
  update(): void {
    this.increaseQuality();
    this.updateSellIn();
    if (this.sellIn < 0) {
      this.increaseQuality(); // Increases twice as fast after sell-by date
    }
  }
}

/**
 * Represents Backstage Passes, which increase in quality as the concert approaches.
 */
class BackstagePass extends UpdatableItem {
  update(): void {
    if (this.sellIn <= BACKSTAGE_THRESHOLDS.CONCERT_DAY) {
      this.quality = QUALITY_LIMITS.MIN;
      this.updateSellIn();
      return;
    }

    if (this.sellIn <= BACKSTAGE_THRESHOLDS.SECOND_BOOST) {
      this.increaseQuality(3);
    } else if (this.sellIn <= BACKSTAGE_THRESHOLDS.FIRST_BOOST) {
      this.increaseQuality(2);
    } else {
      this.increaseQuality();
    }

    this.updateSellIn();
  }
}

/**
 * Represents Sulfuras, a legendary item that never changes.
 */
class Sulfuras extends UpdatableItem {
  update(): void {
    // Legendary item, does not change
  }
}

/**
 * Factory function to create the appropriate UpdatableItem instance based on item type.
 */
function createUpdatableItem(item: Item): UpdatableItem {
  switch (item.name) {
    case ITEM_NAMES.AGED_BRIE:
      return new AgedBrie(item.name, item.sellIn, item.quality);
    case ITEM_NAMES.BACKSTAGE_PASS:
      return new BackstagePass(item.name, item.sellIn, item.quality);
    case ITEM_NAMES.SULFURAS:
      return new Sulfuras(item.name, item.sellIn, item.quality);
    default:
      return new NormalItem(item.name, item.sellIn, item.quality);
  }
}

/**
 * Main GildedRose class that manages the inventory system.
 */
export class GildedRose {
  private readonly items: Array<UpdatableItem>;

  constructor(items: Array<Item>) {
    this.validateItems(items);
    this.items = items.map(createUpdatableItem);
  }

  private validateItems(items: Array<Item>): void {
    if (!Array.isArray(items)) {
      throw new Error("Items must be an array");
    }
    items.forEach((item, index) => {
      if (!(item instanceof Item)) {
        throw new Error(`Invalid item at index ${index}`);
      }
    });
  }

  updateQuality(): Array<Item> {
    this.items.forEach((item) => item.update());
    return this.items;
  }
}
