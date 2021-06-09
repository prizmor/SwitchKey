import {AfterContentChecked, AfterViewInit, Component, DoCheck, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../data.service";

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnDestroy {

  constructor(private router: Router ,private activatedRoute: ActivatedRoute, public svc: DataService) {
    this.svc.setActiveData(this.activatedRoute.snapshot.params.id);
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }


  ngOnDestroy(): void {
    this.svc.activeTextData.name = '';
  }

  onChangeTime($event): void {
    if ($event.target.value.length > 3) {
      let time: any = $event.target.value.split('');
      time.pop();
      time = Number(time.join(''));
      $event.target.value = time;
      this.svc.activeTextData.time = time;
    } else {
      this.svc.setTime();
    }
  }
  onChangeText(): void {
    this.svc.setText();
  }

  onClick(): void {
    this.svc.editMode = false;
    const time = Number(this.svc.activeTextData.time);
    this.svc.time = time;
    this.svc.start(time);
    this.svc.transformArray();
  }

  @HostListener('document:keydown', ['$event'])
  space($event): void {
    if (!this.svc.editMode) {
      if ($event.key == 'Backspace') {
        if (this.svc.activeLitters == 2) {
          this.svc.words[this.svc.activeLitters-2].type = 'notWritten';
          this.svc.words[0].stick = false;
          this.svc.activeLitters--;
        } else if (this.svc.activeLitters > 2) {
          this.svc.words[this.svc.activeLitters-2].type = 'notWritten';
          this.svc.words[this.svc.activeLitters-2].stick = false;
          this.svc.words[this.svc.activeLitters-3].stick = true;
          this.svc.activeLitters--;
        }
      } else if ($event.key == 'Escape') {
        this.svc.counter = 1;
      } else if ($event.key.length == 1 && this.svc.activeLitters != this.svc.littersCount+1) {
        if (this.svc.words[this.svc.activeLitters-1].litter == $event.key ) {
          this.svc.words[this.svc.activeLitters-1].type = 'written';
          this.svc.words[this.svc.activeLitters-1].stick = true;
        } else {
          if (this.svc.words[this.svc.activeLitters-1].litter == ' ') {
            this.svc.words[this.svc.activeLitters-1].type = 'errS';
            this.svc.words[this.svc.activeLitters-1].stick = true;
          } else {
            this.svc.words[this.svc.activeLitters-1].type = 'err';
            this.svc.words[this.svc.activeLitters-1].stick = true;
          }
          this.svc.err++;
        }
        if (this.svc.activeLitters >= 2) {
          this.svc.words[this.svc.activeLitters-2].stick = false;
        }
        this.svc.activeLitters++;
        if (this.svc.activeLitters == this.svc.littersCount+1 || this.svc.counter == 1) {
          this.svc.stopGame();
        }
      }
    }
  }

}
