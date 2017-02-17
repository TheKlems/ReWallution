class Block{
	static getRandomShape(group){
		var bSize = 80;

		var nOfBlocks = Math.floor((Math.random()*4)+1);
		var version3 = Math.floor((Math.random()*2)+1);
		var version4 = Math.floor((Math.random()*7)+1);

		for (var i = 0; i<nOfBlocks*80; i+=80){
			group.create(250+i, 50, 'wall');
		}
		if(nOfBlocks == 3 && version3 == 2){
			group.xy(0,300,50);
			group.xy(1,380,50);
			group.xy(2,380,130);
		}
		if(nOfBlocks==4){
			switch(version4){
				case 1:
					group.xy(0,250,50);
					group.xy(1,330,50);
					group.xy(2,410,50);
					group.xy(3,330,130);
					break;
				case 2:
					group.xy(0,250,50);
					group.xy(1,330,50);
					group.xy(2,410,50);
					group.xy(3,250,130);
					break;
				case 3:
					group.xy(0,250,50);
					group.xy(1,330,50);
					group.xy(2,410,50);
					group.xy(3,410,130);
					break;
				case 4:
					group.xy(0,250,50);
					group.xy(1,330,50);
					group.xy(2,330,130);
					group.xy(3,410,130);
					break;
				case 5:
					group.xy(0,250,130);
					group.xy(1,330,130);
					group.xy(2,330,50);
					group.xy(3,410,50);
					break;
				case 6:
					group.xy(0,250,50);
					group.xy(1,330,50);
					group.xy(2,250,130);
					group.xy(3,330,130);
					break;
				default:
					break;
			}
		}
		
		group.setAll('enableBody', true);

		return;
		/*
		}else{
			var nInFirstLine = Math.floor((Math.random()*(nOfBlocks-1))+2);
			var nInSecondLine = nOfBlocks-nInFirstLine
			var firstLine = Matter.Bodies.rectangle(bSize*nInFirstLine/2,bSize/2,bSize*nInFirstLine, bSize);
			if(nInSecondLine==0){
				return firstLine;
			}
			
			var secondLine = Matter.Bodies.rectangle(0,0,bSize*nInSecondLine, bSize);

			var xMin = (2-nInSecondLine)*bSize/2;
			var xMax = bSize*nInFirstLine-((2-nInSecondLine)*bSize/2);
			var xPos = Math.floor((Math.random()*(xMax-xMin+1))+xMin);

			Matter.Body.setPosition(secondLine, Matter.Vector.create(xPos,-bSize/2));

			var comp = Matter.Body.create({
				parts: [firstLine, secondLine]
			});

			return comp;
		}
		*/
	}

}