let happyFlowerSound: p5.SoundFile;
let sadFlowerCloudSound: p5.SoundFile;
let sadFlowerBeeSound: p5.SoundFile;
let leafLeft: p5.Image;
let leafRight: p5.Image;

interface Flowers {
    bud: p5.Image,
    flower0: p5.Image,
    flower25: p5.Image,
    flower75: p5.Image,
    flower100: p5.Image,
}

class Flower {
    public currentFlower: p5.Image;
    private time: number;
    public readonly r: number;
    private history: p5.Vector[];
    private onlyRenderEachXPoint: number;
    private keepSamePointsForDifferentDrawsAdjuster: number;
    //private leafs: [];
    //private leafX: number;
    //private leafY: number;
    private leafYLeft: number; 
    private leafXLeft: number;

    private leafYRight: number;
    private leafXRight: number;


    public constructor(x: number, y: number, private width: number, private height: number) {
        this.currentFlower = listOfFlowers.bud;
        this.time = 0;
        this.r = 36;
        this.onlyRenderEachXPoint = 40;
        this.keepSamePointsForDifferentDrawsAdjuster = this.onlyRenderEachXPoint;
        this.history = [createVector(x, y)];
        //this.leafs = []
        //this.leafX = this.endOfStem.x;
        //this.leafY = 300;
        this.leafYLeft = 300; 
        this.leafXLeft = this.endOfStem.x;
        this.leafYRight = 300; 
        this.leafXRight = this.endOfStem.x  
    }

    public get beginningOfStem() {
        return this.history[0];
    }

    public get endOfStem() {
        return this.history[this.history.length - 1]
    }

    public update() {
        const newX = this.handlePlayerInput();
        this.grow(newX);
        this.move();
    }

    private grow(x: number) {
        const y = this.endOfStem.y - 1.5;
        const maxLength = height / 2;
        var v = createVector(x, y);

        this.history.push(v);
        if (this.history.length > maxLength) {
            this.history.shift();
        }

        this.time += deltaTime;

        if (this.time > 5000) {
            this.currentFlower = listOfFlowers.flower75;
        }
    }

    private growingLeaf(){


        if (this.time > 1500) {
            let leafTime = 0;

            if (millis() >= 3000 + leafTime ){
                
                image(leafLeft, this.leafXLeft - 50, this.leafYLeft - 12, 50,25);
                leafTime = millis(); 
                
                this.leafYLeft += 1.5;

                if (this.leafYLeft >= 600){
                    this.leafYLeft = 288;
                    this.leafXLeft = this.endOfStem.x;
                }   
            }
        }

        if (this.time > 3000) {

            let leafTime = 0;
                if (millis() >= 3000 + leafTime ){
                    image(leafRight, this.leafXRight, this.leafYRight - 12, 50,25);
                    leafTime = millis(); 
                    
                    this.leafYRight += 1.5;
    
                    if (this.leafYRight >= 600){
                        this.leafYRight = 288;
                        this.leafXRight = this.endOfStem.x;
                    }   
                }
            }
    }

/*     private growingLeaf(){
        if (this.time > 3000) {

        let leafTime = 0;
        let leafY = 300; 
        let leafX = this.endOfStem.x  

        if (millis() >= 4500 + leafTime ){
            image(leafRight, leafX, leafY - 12, 50,25);
            leafTime = millis();  
        }

        leafY += 1.5;

        if (leafY >= 600){
            leafY = 288;
            leafX = this.endOfStem.x;
        }
    }
} */

    private move() {
        for (const point of this.history) {
            point.y += 1.5;
        }
    }

    private handlePlayerInput(): number {
        let x = this.endOfStem.x
        if (this.time > 5000) {
            if (keyIsDown(65)) {
                x -= 3;
            }
            else if (keyIsDown(68)) {
                x += 3;
            }
            if (x > width - this.r) {
                x = width - this.r;
            }
            if (x < this.r) {
                x = this.r;
            }
        }
        return x;
    }

    private resolveHistoryPositionsToDraw(): Array<p5.Vector> {
        const pointsToDraw = [];
        pointsToDraw.push(createVector(this.beginningOfStem.x, 600));
        pointsToDraw.push(this.beginningOfStem);
        for (let i = this.keepSamePointsForDifferentDrawsAdjuster % this.onlyRenderEachXPoint; i < this.history.length; i += this.onlyRenderEachXPoint) {
            pointsToDraw.push(this.history[i]);
        }
        pointsToDraw.push(this.endOfStem);

        this.keepSamePointsForDifferentDrawsAdjuster--;
        if (this.keepSamePointsForDifferentDrawsAdjuster === 0) this.keepSamePointsForDifferentDrawsAdjuster = this.onlyRenderEachXPoint;

        return pointsToDraw;
    }

    public draw() {
        stroke(100, 215, 46)
        strokeWeight(6);
        noFill();
        const historyPositionsToDraw = this.resolveHistoryPositionsToDraw();
        beginShape();
        curveVertex(historyPositionsToDraw[0].x, historyPositionsToDraw[0].y);
        for (let i = 0; i < historyPositionsToDraw.length; i++) {
            curveVertex(historyPositionsToDraw[i].x, historyPositionsToDraw[i].y);
        }
        curveVertex(historyPositionsToDraw[historyPositionsToDraw.length - 1].x - 1, historyPositionsToDraw[historyPositionsToDraw.length - 1].y - 1);
        endShape();
        push();
        //imageMode(CENTER);
        this.growingLeaf();
        pop();
        push();
        imageMode(CENTER);
        image(this.currentFlower, this.endOfStem.x, this.endOfStem.y, this.width, this.height);
        pop();
        push();
        noFill();
        noStroke();
        ellipseMode(CENTER);
        ellipse(this.endOfStem.x, this.endOfStem.y, this.r * 2, this.r * 2);
        pop();

    }
}