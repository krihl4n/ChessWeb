import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { ControlsComponent } from './controls/controls.component';
import { CapturesComponent } from './captures/captures.component';
import { GameFinishedDialogComponent } from './game-finished-dialog/game-finished-dialog.component';
import { BoardCanvasComponent } from './board-canvas/board-canvas.component';
import { AppRoutingModule } from './app-routing.module';
import { GameComponent } from './game/game.component';
import { SvgTestComponent } from './svg-test/svg-test.component';
import { BoardCanvasWithCssAnimationsComponent } from './board-canvas-with-css-animations/board-canvas-with-css-animations.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    ControlsComponent,
    CapturesComponent,
    GameFinishedDialogComponent,
    BoardCanvasComponent,
    GameComponent,
    SvgTestComponent,
    BoardCanvasWithCssAnimationsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
