export default class exp {
  /**
   * ## 経験値からレベルへ変換
   * # [焼肉食べたい](https://www.yakiniku-king.jp/)
   *
   * @static
   * @param {number} exp [総経験値]
   * @return {number} [レベル]
   * @memberof exp
   */
  public static toLevel(exp: number): number {
    return (exp / 100) | 0
  }

  /**
   * ## レベルにならない余りの経験値に変換
   *
   * @static
   * @param {number} exp
   * @return {number} [余りの経験値]
   * @memberof exp
   */
  public static toRemainderExp(exp: number): number {
    return exp % 100
  }
}
