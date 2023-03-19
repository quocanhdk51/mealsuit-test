import { NgModule } from "@angular/core";
import { NameAbbreviatePipe } from "./name-abbreviate.pipe";

@NgModule({
    declarations: [NameAbbreviatePipe],
    exports: [NameAbbreviatePipe]
})
export class NameAbbreviateModule {}