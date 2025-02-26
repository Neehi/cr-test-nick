import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import{ filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Loading...';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    // TODO: Remove if not needed - rxjs has changed with angular 6
    // this.router.events
    // .filter(event => event instanceof NavigationEnd)
    // .map(() => this.activatedRoute)
    // .map(route => {
    //   while (route.firstChild) {
    //     route = route.firstChild;
    //   }
    //   return route;
    // })
    // .filter(route => route.outlet === 'primary')
    // .mergeMap(route => route.data)
    // .subscribe(event => {
    //   if (event['title']) {
    //     this.setTitle(event['title']);
    //   }
    // });
  }

  setTitle(title: string) {
    this.titleService.setTitle(`${title} - Clear Review`);
    this.title = title;
  }
}
