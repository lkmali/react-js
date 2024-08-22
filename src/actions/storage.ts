export const storageActions = {
  storageInstance: localStorage,

  storeItem(key: string, value: string) {
    this.storageInstance.setItem(key, value)
  },

  getItem(key: string) {
    return this.storageInstance.getItem(key)
  },

  clearStorage() {
    this.storageInstance.clear()
  },

  storeItems(keys: string[], values: string[]) {
    keys.map((key, i) => {
      return this.storeItem(key, values[i])
    })
  },
}
