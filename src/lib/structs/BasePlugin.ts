import { PluginType } from '@/typings';
import { generateID } from '@/utils';

/**
 * Base for all plugin types
 */
export default abstract class BasePlugin {
  public readonly type: PluginType;

  public readonly id: string;

  /**
   * @param {PluginType} type Plugin type
   * @param {string} [id] Plugin id (will generate a random unique id if not provided)
   */
  constructor(type: PluginType, id?: string) {
    this.type = type;
    this.id = id ?? generateID();
  }
}