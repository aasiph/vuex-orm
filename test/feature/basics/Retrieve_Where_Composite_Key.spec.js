import { createStore } from 'test/support/Helpers'
import Model from 'app/model/Model'

describe('Feature – Retrieve – Where - Composite Keys', () => {
  class User extends Model {
    static entity = 'users'

    static primaryKey = ['key_1', 'key_2']

    static fields () {
      return {
        key_1: this.attr(null),
        key_2: this.attr(null)
      }
    }
  }

  it('can retrieve records that matches the whereId clause', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 }
      ]
    })

    const expected = { $id: '[1,2]', key_1: 1, key_2: 2 }

    const user = store.getters['entities/users/query']()
      .whereId([1, 2])
      .first()

    expect(user).toEqual(expected)
  })

  it('can retrieve records that matches the whereId clause using intersection ("and" boolean)', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 }
      ]
    })

    const users = store.getters['entities/users/query']()
      .whereId([1, 2])
      .whereId([2, 2])
      .get()

    const expected = []

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereId and orWhere', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 }
      ]
    })

    const expected = [
      { $id: '[1,2]', key_1: 1, key_2: 2 },
      { $id: '[2,2]', key_1: 2, key_2: 2 }
    ]

    const users = store.getters['entities/users/query']()
      .whereId([1, 2])
      .orWhere('key_1', 2)
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn clause', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 },
        { key_1: 3, key_2: 2 }
      ]
    })

    const expected = [
      { $id: '[2,2]', key_1: 2, key_2: 2 },
      { $id: '[3,2]', key_1: 3, key_2: 2 }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([[2, 2], [3, 2]])
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn clause using intersection ("and" boolean)', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 },
        { key_1: 3, key_2: 2 }
      ]
    })

    const expected = [
      { $id: '[2,2]', key_1: 2, key_2: 2 }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([[2, 2], [3, 2]])
      .whereIdIn([[1, 2], [2, 2]])
      .get()

    expect(users).toEqual(expected)
  })

  it('can retrieve records that matches the whereIdIn and orWhere', () => {
    const store = createStore([{ model: User }])

    store.dispatch('entities/users/create', {
      data: [
        { key_1: 1, key_2: 2 },
        { key_1: 2, key_2: 2 },
        { key_1: 3, key_2: 2 }
      ]
    })

    const expected = [
      { $id: '[1,2]', key_1: 1, key_2: 2 },
      { $id: '[2,2]', key_1: 2, key_2: 2 },
      { $id: '[3,2]', key_1: 3, key_2: 2 }
    ]

    const users = store.getters['entities/users/query']()
      .whereIdIn([[2, 2], [3, 2]])
      .orWhere('key_1', 1)
      .all()

    expect(users).toEqual(expected)
  })
})
