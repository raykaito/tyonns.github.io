class Field{
    constructor(width,height){
        this.width=width;
        this.height=height;
        this.h = this.width/2;
        this.k = this.height/2;
        this.sunStd = this.width*0.0001;
        this.sunIntensity = 1.5;
        this.energy = new Array(width*height).fill(50);
        this.gaussianIntensityDistribution = new Array(1000);
        this.spreadableTiles = new Array(width*height).fill(true);
        this.getGaussDistribution(this.gaussianIntensityDistribution);
        this.sunX;
        this.sunY;
        this.update(new Date().getSeconds()+0.5);/*
        //Parameters for grass
        this.grassEnergy = new Array(width*height).fill(0);
        this.grassState  = new Array(width*height).fill(0);//[0:Doesn't Exist, 1:Dead, 2:Alive];
        this.grassAliveIndex = new Array();
        this.spreadableTiles = new Array(width*height).fill(true);*/
    }
    getGaussDistribution(gaussianDistribution){
        /*
        for(let iGauss=0;iGauss<gaussianDistribution.length;iGauss++){
            const yGauss=Math.floor(iGauss/this.width)*4;
            const xGauss=(iGauss%this.width)*4;
            const distanceGauss = Math.sqrt((xGauss)*(xGauss)+(yGauss)*(yGauss));
            gaussianDistribution[iGauss] = this.sunIntensity*Math.exp(-distanceGauss*distanceGauss/(2*this.sunStd*this.sunStd));
        }
        */
       for(let iGauss=0; iGauss<gaussianDistribution.length; iGauss++){
            gaussianDistribution[iGauss]=this.sunIntensity*Math.exp(-((iGauss/gaussianDistribution.length * 10 * this.sunStd)**2)/(2*this.sunStd**2));
       }
    }
    update(time){
        const theta = (time/60)*2 * Math.PI;
        this.sunX = this.h+ 0.7 * this.h*Math.cos(theta);
        this.sunY = this.k+ 0.7 * this.k*Math.sin(theta);
        this.sunShine();
    }
    draw(canvas){
        canvas.ct.strokeStyle = "";
        let imgData = canvas.ct.getImageData(0,0,this.width,this.height);
        for(let i=0;i<this.energy.length;i++){
            const y=Math.floor(i/this.width);
            const x=i%this.width;
            imgData.data[i*4+0]=this.energy[i];
            imgData.data[i*4+1]=this.energy[i];
            imgData.data[i*4+2]=this.energy[i];
        }
        canvas.ct.putImageData(imgData,0,0);
    }
    changeEnergy(x,y,energyAdded){
        this.energy[x+y*this.width] += energyAdded;
    }
    sunShine(){
        let totalEnergyAdded=0;
        let maxEnergyAdded=0;
        for(let iEnergy=0;iEnergy<this.energy.length;iEnergy++){
            const y=Math.floor(iEnergy/this.width);
            const x=iEnergy%this.width;
            const distance = Math.floor((((Math.abs(y - this.sunY))**2 + Math.floor(Math.abs(x - this.sunX))**2) ** .5)/(this.width/this.gaussianIntensityDistribution.length));
            //const deltaY=Math.floor(Math.abs(y - this.sunY));
            //const deltaX=Math.floor(Math.abs(x - this.sunX));
            let energyAdded = 0;
            if(distance < this.gaussianIntensityDistribution.length)
                energyAdded = this.gaussianIntensityDistribution[distance];  
            totalEnergyAdded+=energyAdded;
            maxEnergyAdded = Math.max(maxEnergyAdded,energyAdded);
            this.changeEnergy(x,y,energyAdded);
        }
        console.log(totalEnergyAdded,maxEnergyAdded);

    }
}

console.log("Loaded: grass.js");