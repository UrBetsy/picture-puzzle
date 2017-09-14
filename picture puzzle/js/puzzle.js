//@ sourceURL=puzzle.js  
(function(){
  var Puzzle,Blank,Cell;
  
  Puzzle = (function(){
    function Puzzle(pic){
      var image,cell,x,y,i;
      this.pic=pic;
      this.squre = [];
      this.originalSqure = []; 
      //将图片插入预览框img标签的class为Thumbnails；
      image = this.pic;
      $('#previews').append('<img src="' + image + '" class="Thumbnails"/>');    
      //初始化每个小方格包括空格
      for (i=0;i<=7; i++){
        x=Math.floor(i%3)*110;
        y=Math.floor(i/3)*110;
        cell=new Cell(i,110,110,x,y,this.pic);
        this.squre.push(cell);
      }
      this.squre.push(new Blank(8));
      this.originalSqure=this.squre.slice(0);/*将初始顺序保存下来验证是否正确*/
      this.mixup();
    }

  Puzzle.prototype.mixup=function(){
	  var blankpos,randomNum,newSqure;
	  blankpos=8;
	  newSqure=[];
	  //利用空格个随机各自交换达到打乱的效果
	  for(var i=0;i<=8;i++){
	    randomNum=Math.floor(Math.random()*9);
	    this.switchPosition(randomNum,blankpos);
	    newSqure.push(blankpos=randomNum);
	  }
	  return newSqure;
	};

	Puzzle.prototype.checkIfWon = function() { 
		//只有当所有各自和原始状态一致的时候返回true
	  for (var i=0;i<=8;i++){
	    if (this.squre[i]===this.originalSqure[i]){
	      continue;
	    } else {
	      return false;
	    }
	  }
	  return true;
	};

	Puzzle.prototype.blankPosition = function() {
		//当class为Blank的成立的时候返回位置。
	  var squre,pos,len, ref;
	  ref=this.squre;
	  len=ref.length
	  for(pos=0;pos<len;pos++){
	    squre=ref[pos];
	    if(squre["class"]==='Blank'){
	      return pos;
	    }
	  }
	};

	Puzzle.prototype.canvasBoard=function() {
	//每次交换之后都检查画板的情况。
	 var blank,t,len,ref,
	  _this=this;
	  blank=this.blankPosition();
	  $('#canvas').html('');
	  if(this.checkIfWon()){
	    $('#canvas').append('<span id="windiv"><img src="'+this.pic+'"/><div class="banner">VICTORY ！</div></span>');
	    return $('#windiv').show('slow');
	  }else{
	    ref=this.squre;
	    len=ref.length;
	    //重置每个方格的状态
	    for(var i=0;i<len;i++){
	      t=ref[i];
	      t.show(blank);
	    }
	    return $('.clickable').bind('click',function(event){
	      var toSwitch;
	      toSwitch=event.target.id;
	      return _this.switchPosition(toSwitch,_this.blankPosition());
	    });
	  }	 
	};
	    
	Puzzle.prototype.switchPosition=function(pos1, pos2){
	  var one,two;
	  one=this.squre[pos1];
	  two=this.squre[pos2];
	  this.squre[pos2]=one;
	  this.squre[pos1]=two;
	  this.squre[pos2].position = pos2;
	  return this.canvasBoard();
	};
    return Puzzle;
  })();

  Cell=(function(){
    function Cell(position,width,height,x,y,image){
      this.position=position;
      this.width=width;
      this.height=height;
      this.x=x;
      this.y=y;
      this.image=image;
      this["class"]='Cell';
    }

    Cell.prototype.show=function(blankPosition){
      if(this.isAdjacent(blankPosition)){
        $('#canvas').append('<div id="'+this.position+'"class="innerSquare imageSquare clickable"></div>');
      }else{
        $('#canvas').append('<div id="'+this.position+'"class="innerSquare imageSquare"></div>');
      }
      $("#"+this.position).css('background-position','-'+this.x + 'px -' + this.y + 'px');
      return $("#"+this.position).css('background-image', 'url(' + this.image + ')');
    };

    Cell.prototype.isAdjacent=function(blanksPosition){
      if (blanksPosition-1===this.position && (blanksPosition % 3) > 0 || blanksPosition + 1 === this.position && (blanksPosition % 3) < 2 || blanksPosition + 3 === this.position && (blanksPosition / 3) < 2 || blanksPosition - 3 === this.position && (blanksPosition / 3) > 0) {
        return true;
      }
      return false;
    };

    Cell.prototype.setImage=function(image){
      return this.image=image;
    };
    
    return Cell;

  })();

  Blank=(function(){
  	//将位置position的块属性class设置为Blank方便对空格子的判断
    function Blank(position) {
      this.position = position;
      this["class"] = 'Blank';
    }

    Blank.prototype.show = function() {
      return $('#canvas').append('<div class="innerSquare blank"></div>');
    };

    return Blank;

  })();

  $(document).ready(function(){
    var pic, puzzle;
    pic='img/img1.jpg';
    return puzzle = new Puzzle(pic);
  });

})();

