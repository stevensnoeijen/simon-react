import React from 'react';
import './Board.scss';
import { Button } from '../button/Button';

export type BoardProps = {

}

export type BoardState = {
  level?: number;
  startButtonEnabled?: boolean;
  buttons: {
    green?: boolean;
    red?: boolean;
    yellow?: boolean;
    blue?: boolean;
  };
}

export class Board extends React.Component<BoardProps, BoardState> {
  /**
   * Light pattern of simon
   */
  private pattern: string[] = [];
  /**
   * Current click the user is at.
   * If -1 the user hasn't clicked yet.
   */
  private userStep = -1;
  /**
   * If the user his turn started,
   * now button clicks will respond.
   */
  private userTurn = false;

  public constructor(props: BoardProps) {
    super(props);

    this.state = {
      level: 0,
      startButtonEnabled: true,
      buttons: {
        green: false,
        red: false,
        yellow: false,
        blue: false,
      },
    };

    this.startGame = this.startGame.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
  }

  public render(): JSX.Element {
    return (
      <div className={'circle'}>
        <div>
          <Button className={'quarter-circle-top-left'} color={'green'} on={this.state.buttons.green as boolean} onClick={this.buttonClick} />
          <Button className={'quarter-circle-top-right'} color={'red'} on={this.state.buttons.red as boolean} onClick={this.buttonClick} />
        </div>
        <div>
          <Button className={'quarter-circle-buttom-left'} color={'yellow'} on={this.state.buttons.yellow as boolean} onClick={this.buttonClick} />
          <Button className={'quarter-circle-bottom-right'} color={'blue'} on={this.state.buttons.blue as boolean} onClick={this.buttonClick} />
        </div>
        <div className={'inner-center'}>
          <strong>SIMON</strong>
          <div>
            <button disabled={!this.state.startButtonEnabled} onClick={this.startGame} className={'start-button'} title={'start game'}></button>
          </div>
          <sub>
            lvl {this.state.level}
          </sub>
        </div>
      </div>
    );
  }

  private async startGame(): Promise<void> {
    this.pattern = [];
    this.userStep = -1;
    this.setState({
      startButtonEnabled: false,
    });
    await this.runNewRound();
  }

  private increaseLevel(): void {
    const level = this.pattern.length + 1;
    this.setState({
      level: level,
    });
    this.increasePattern();
  }

  /**
   * @return color
   */
  private generateColor(): string {
    const newNumber = Math.floor(Math.random() * 4);
    let color;
    switch (newNumber) {
      case 0:
        color = 'green';
        break;
      case 1:
        color = 'red';
        break;
      case 2:
        color = 'yellow';
        break;
      case 3:
        color = 'blue';
        break;
    }
    return color as string;
  }

  private increasePattern(): void {
    const color = this.generateColor();
    this.pattern.push(color);
  }

  private async runNewRound(): Promise<void> {
    this.increaseLevel();
    this.playPattern();
    this.startUserTurn();
  }

  private startUserTurn(): void {
    this.userStep = -1;
    this.userTurn = true;
  }

  private async playPattern(): Promise<void> {
    for (const color of this.pattern) {
      this.setButton(color, true);
      await sleep(500);
      this.setButton(color, false);
      await sleep(250);
    }
  }

  private setButton(color: string, on: boolean): void {
    this.setState({
      buttons: {
        [color]: on,
      },
    });
  }

  private async buttonClick(color: string): Promise<void> {
    if (this.userTurn === false) {
      // cancel click if its not the user's turn
      return;
    }
    this.userTurn = false;
    this.userStep++;

    // check step
    const isValid = this.pattern[this.userStep] === color;
    if (!isValid) {
      alert('incorrect! game over');
      this.resetGame();
      return;
    }
    // if last step was clicked
    if (this.pattern.length === (this.userStep + 1)) {
      this.userTurn = false;
      await sleep(1000);
      this.runNewRound();
      return;
    }

    this.userTurn = true;
  }

  private resetGame(): void {
    this.userStep = -1;
    this.setState({
      level: 0,
      startButtonEnabled: true,
    });
  }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}