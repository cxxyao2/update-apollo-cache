import { Injectable } from '@angular/core';
import { cloneDeep } from '@apollo/client/utilities';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class ApolloUtilService {
  constructor(private apollo: Apollo) {}

  /**
   * Update a single record using id in apollo cache.
   *
   * @param objectName The name of the object in the cache, which is capitalized, such as 'Book'. However, the entity in the cache is lowercase and in the plural form, such as 'books'.
   * @param id The id of the object, which is unique for the entity, refering to the record  in local cache, such as  "Book:11233"
   * @param data The data to update the entity with.
   * @example
   * updateCachedRecordById('Book', '1233', {age: 12, name: 'New Name' });
   *
   */
  updateCachedRecordById<T extends Record<string, any>>(
    objectName: string,
    id: string,
    data: T
  ): void {
    const fields = Object.keys(data)
      .map((field) => `${field}`)
      .join('\n');

    // MyObject is a random fragment name, which can be any name,but should be constant instead of a variable in the gql template string
    const fragmentQuery = gql`
      fragment MyObject on ${objectName} {
       ${fields}
      }
    `;
    this.apollo.client.writeFragment({
      id: objectName + ':' + id,
      fragment: fragmentQuery,
      data: data,
    });
  }

  // Update a record without 'id' field in local cache
  // for instance, the entity is "books", and the record is below:
  // __typename: "Book"
  // name: "grapes 🍇 delicious"
  // genre: "Fiction"
  // updateCachedRecordWithoutId('books',{name:'oldname'},{name:'newname',age:12})
  updateCachedRecordWithoutId<T extends Record<string, any>>(
    cacheEntity: string,
    filter: T,
    data: T
  ): void {
    this.apollo.client.cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        [cacheEntity]: (items = []) => {
          const oldItems = cloneDeep(items);
          const index = oldItems.findIndex((rec: T) =>
            Object.keys(filter).every((key) => {
              const k = key as keyof T;
              return rec[k] === filter[k];
            })
          );

          if (index < 0) return items;

          const newItems = cloneDeep(items);
          newItems[index] = { ...newItems[index], ...data };
          return newItems;
        },
      },
    });
  }

  /**
   * Remove a record using id from an entity in Apollo cache .
   * This method is limited to entities with an 'id' field.
   *
   * @param cacheEntity The name of the entity in the cache.
   * @param id  The id of the entity.
   * @example
   * removeCachedRecordByid('equipments', '1233');
   *
   */
  removeCachedRecordByid(cacheEntity: string, id: string): void {
    this.apollo.client.cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        [cacheEntity]: (items: { __ref: string }[] = [], { readField }) => {
          const i = items.findIndex(
            (rec: { __ref: string }) => readField('id', rec) === id
          );
          if (i < 0) return items;

          const newRecords = cloneDeep(items);
          newRecords.splice(i, 1);
          return newRecords;
        },
      },
    });
  }

  /**
   * Remove a record without 'id' field from an entity in apollo cache
   * This method is used when you need to remove the cache with a custom key.
   *
   * @param cacheEntity The name of the entity in the cache.
   * @param filter The key or keys of the entity you want to update.
   * @example
   * removeCachedRecordWithoudId('workorderliness', { workOrderNo:'abcd',lineNo:10000});
   * */
  removeCachedRecordWithoudId<T>(
    cacheEntity: string,
    filter: Partial<T> extends object ? Partial<T> : never
  ): void {
    this.apollo.client.cache.modify({
      id: 'ROOT_QUERY',
      fields: {
        [cacheEntity]: (items = [], { DELETE }) => {
          const oldItems = cloneDeep(items);
          const newItems = oldItems.filter(
            (rec: T) =>
              !Object.keys(filter).every((key) => {
                const k = key as keyof T;
                return rec[k] === filter[k];
              })
          );

          // If the record is empty, delete it.
          // This is to prevent the cache from returning an empty array. Which causes an error when adding a first item.
          if (newItems.length === 0) return DELETE;
          return newItems;
        },
      },
    });
  }
}
