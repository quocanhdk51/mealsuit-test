import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[preventClickFallback]'
})
export class PreventClickFallbackDirective {
    @HostListener("click", ["$event"])
    public onClick(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
    }
}