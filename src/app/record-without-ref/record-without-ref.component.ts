import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { gql, Apollo } from 'apollo-angular';
import { Book } from '../models/book';
import { from, Observable, of, Subscription } from 'rxjs';
import { concatAll, concatMap, map, switchMap, take } from 'rxjs/operators';
import { ApolloUtilService } from '../apollo-util.service';

const GET_BOOKS = gql`
  query {
    books {
      name
      genre
    }
  }
`;

@Component({
  selector: 'app-record-without-ref',
  templateUrl: './record-without-ref.component.html',
  styleUrls: ['./record-without-ref.component.css'],
})
export class RecordWithoutRefComponent implements OnInit, OnDestroy {
  allBooks = signal<Book[]>([]);
  targetName = '';
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

  updateCachedRecordWithoutId(): void {
    this.apolloUtilService.updateCachedRecordWithoutId<Partial<Book>>(
      'books',
      { name: this.targetName },
      { name: 'grapes 🍇 delicious' }
    );
  }

  removeRecordWithoutIdInLocalCache(): void {
    this.apolloUtilService.removeCachedRecordWithoudId<Partial<Book>>('books', {
      name: this.targetName,
    });
  }

  ngOnDestroy() {
    this.querySubscription?.unsubscribe();
  }
}
