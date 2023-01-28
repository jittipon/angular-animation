import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {animate, keyframes, style, transition, trigger} from "@angular/animations";


interface Section {
  name: string;
  image: string;
}

interface SectionWithRectDomData {
  name: string;
  image: string;
  cal: number;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('fade', [
      transition('out => in', animate('500ms', keyframes([
        style({opacity: 0, offset: 0}),
        style({opacity: 0.5, offset: 0.5}),
        style({opacity: 1, offset: 1.0}),
      ]))),

    ])
  ]
})
export class LandingComponent implements OnInit {

  selectedImage = '1.jpg';
  animationState = 'out';
  stackScrollTop: number[] = [];
  sections: Section[] = [
    {
      name: 'section1',
      image: '1.jpg'
    },
    {
      name: 'section2',
      image: '2.jpg'
    }, {
      name: 'section3',
      image: '3.jpg'
    }

  ]

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event: any) {
    this.validateScroll($event);
  }

  ngOnInit() {

  }

  addStack(value: number): void {
    this.stackScrollTop.push(value);
    if (this.stackScrollTop.length > 2) {
      this.stackScrollTop.shift()
    }
  }

  validateScroll(event: any) {
    this.addStack(event.target.scrollTop);
    const sectionsWithRectDomData: SectionWithRectDomData[] = [];
    this.sections.forEach(i => {
      const element = document.getElementById(i.name);
      const rect = element?.getBoundingClientRect();

      // console.log(rect)
      if (rect && (rect.top <= 0 && rect.height - rect.top > (0.3 * rect.height) || (rect.top > 0 && rect.top < 0.7 * rect.height)) && rect.top >= -1 * (rect.height)) {
        console.log('current section' + i + '  ||| rect.top => ' + rect.top + 'rect.height => ' + rect.height, rect);
        const cal = rect.top >= 0 ? rect.height - rect.top : rect.height + rect.top;
        if (cal > (rect.height * 0.3)) {
          sectionsWithRectDomData.push({
            name: i.name,
            image: i.image,
            cal: rect.top >= 0 ? rect.height - rect.top : rect.height + rect.top
          })
        }
      }
    })

    const result = this.calculateSectionChange(sectionsWithRectDomData)

    if (result.image !== this.selectedImage) {
      this.animationState = 'in';
      this.selectedImage = result.image;
      setTimeout(() => {
        this.animationState = 'out';
        this.changeDetectorRef.detectChanges();
      }, 500);
    }
  }

  calculateSectionChange(section: Section[]): Section {
    const lastIndex = this.stackScrollTop.length - 1;
    if (section.length > 1) {
      if (this.stackScrollTop[lastIndex] > this.stackScrollTop[0]) {
        const sectionLastIndex = section.length - 1;
        return section[sectionLastIndex]
      } else {
        return section[0]
      }
    } else {
    }
    return section[0]
  }
}
