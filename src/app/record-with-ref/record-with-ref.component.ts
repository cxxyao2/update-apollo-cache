import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Book } from '../models/book';
import { from, Observable, of, Subscription } from 'rxjs';
import { concatAll, concatMap, map, switchMap, take } from 'rxjs/operators';
import { ApolloUtilService } from '../apollo-util.service';

const GET_BOOKS = gql`
  query {
    books {
      id
      name
      genre
    }
  }
`;

const Get_ONE_BOOK = gql`
  query GetOneBook($id: ID) {
    book(id: $id) {
      id
      name
      genre
    }
  }
`;

@Component({
  selector: 'app-record-with-ref',
  templateUrl: './record-with-ref.component.html',
  styleUrls: ['./record-with-ref.component.css'],
})
export class RecordWithRefComponent implements OnInit, OnDestroy {
  allBooks = signal<Book[]>([]);
  targetId = '';
  private querySubscription?: Subscription;

  constructor(
    private apollo: Apollo,
    private apolloUtilService: ApolloUtilService
  ) {}

  ngOnInit(): void {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_BOOKS,
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.allBooks.set(data.books);
        console.log('allBooks: ', this.allBooks());
      });
  }

  ReadLocalById(): void {
    // 其他方式: 筛选出id相同的记录
    //  must watchQuery first , which fetches data from remote server, then readQuery from local cache
    const result = this.apollo.client.readQuery({
      query: Get_ONE_BOOK,
      variables: {
        id: this.targetId,
      },
    });

    console.log('result: ', (result as any).book);
  }

  fetchById(): void {
    // get data by id from local cache
    this.apollo
      .watchQuery<any>({
        query: Get_ONE_BOOK,
        variables: {
          id: this.targetId,
        },
      })
      .valueChanges.pipe(take(1))
      .subscribe(({ data, loading }) => {
        console.log('id', this.targetId);
        console.log('result: ', data.book);
      });
  }

  writeQueryById3(): void {
    this.apolloUtilService.updateCachedRecordById<Partial<Book>>(
      'Book',
      this.targetId,
      { name: 'grapes 🍇 delicious' }
    );
  }

  writeQueryById2(): void {
    // succeeded. upated a segment of an object
    this.apollo.client.writeFragment({
      id: 'Book:' + this.targetId,
      fragment: gql`
        fragment MyBook on Book {
          name
        }
      `,
      data: {
        name: 'grapes 🍇 delicious',
      },
    });
  }

  writeQueryById(): void {
    // succeeded. updated local cache directly by id without updating remote server.

    this.apollo.client.writeQuery({
      query: gql`
        query WriteBook($id: ID) {
          book(id: $id) {
            id
            name
            genre
          }
        }
      `,
      data: {
        // Contains the data to write
        book: {
          __typename: 'Book',
          id: this.targetId,
          name: 'Buy grapes 🍇',
          genre: 'happy fruit',
        },
      },
      variables: {
        id: this.targetId,
      },
    });
  }

  // remove from local cache: succeeded
  // attentiion: Object name is  case sensitive,for instance,'Book:123' or 'books'
  removeRecordById(): void {
    this.apolloUtilService.removeCachedRecordByid('books', this.targetId);
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }
}
