/**
 * Developer： WangYue
 * Time：2018/09/210
 * version 1.0.0
 * */
;
( function( win,doc ){
	
	function moonToastRender( options ){
		if( !options ){
			return false;
		}
		var _this = this;
		this.settings = $.extend({}, this.defaults);
	  	if (typeof options !== 'string') {
            $.extend(this.settings, options);
        } else {
            this.settings.message = options;
        }
        
        this.content = this.settings.content || this.settings.text || this.settings.message;
        
        this.settings.position = this.settings.position ? this.settings.position : "right-bottom"
        
     	var position = this.settings.position.split('-');
     	this.putTo = position[1] == 'bottom' ? 'appendTo' : 'prependTo';
        
        var containerClass = this.pluginName + '-wrap';
        var self_container = $( "."+ containerClass + "." +this.settings.position );
        
        var html = '<div class="toast moonToast mtoast-' + this.settings.type+ ' ">' +
						'<span class="close mt-icon mt-icon-delete"></span>' +
						'<span class="mt-icon mt-icon-' + this.settings.icon + '"></span>' + 
						'<span class="moonToast-container">' +
							'<span class="moonToast-content">' + this.content + '</span>' +
						'</span>'
					'</div>';
        
        
        this.$el = $( html );
        
        if( typeof this.settings.dataObj == "object" && !this.isEmptyObject( this.settings.dataObj )  ){
			$.each( this.settings.dataObj, function( key,value  ) {
				_this.$el.attr( "data-"+key,value );
			});
		}
        
        this.$el.click(function( ev ){
			var oEvent = ev || event;
			
			if( typeof _this.settings.onClick == "function" ){
				_this.settings.onClick( _this );
			}
			
		});
		this.$el.find( ".close" ).click( function( ev ){
			var oEvent = ev || event;
			
			
			if( typeof _this.settings.onClose == "function" ){
				_this.settings.onClose( this );
			}
//			$(this).parent().remove();
			_this.hide(300)
			oEvent.preventDefault();
			oEvent.stopPropagation() ;
		} )
		
		if( self_container.length ) {
		
			self_container.append( this.$el );
		
		}else{
			var toast_container = $( "<div class=' "+containerClass+" "+this.settings.position+" '></div>" ).appendTo( $("body") );
			toast_container.append( this.$el );

		}
		
		this.$el.animate({
            opacity: 1,
        }, this.settings.animationDuration);

		
		
		//Automatic closing
		
        if (this.settings.timeout !== false) {
            var secondsTimeout = parseInt(this.settings.timeout),
                timer = this.hide(secondsTimeout),
                plugin = this;

            // Pausa o timeout baseado no hover
            this.$el.hover(
                clearTimeout.bind(window, timer),
                function() {
                    timer = plugin.hide(secondsTimeout);
                });
        }  
	}

	$.extend(moonToastRender.prototype, {
		/*
		 * Basic setting
		 *  @type {Object} defaults
		 * */
		pluginName : "moonToast",
		defaults: {
			message: '提示!', // String: HTML
			type: 'black',  // String: ['black', 'green', 'blue', 'red','orange']
			icon : "success", // String: ['success', 'fail', 'warn', 'delete']
			position:'right-bottom', // String: ['left-top', 'left-center', 'left-bottom', 'right-top', 'right-center', 'right-bottom','center-top','center-center','center-bottom']
            timeout: false,
           	dismissable: true,
           	animationDuration : 500,
           	dataObj:{},  // Object
           	onClose : function(){
           		alert( "关闭！" );
           		
           	},
           	onClick : function(  ){
           		alert( "点击" );
           	}
        },
       
        icons: {
            success: 'success',
            fail: 'fail',
            warn: 'warn',
            delete: 'delete'
        },
        
        /*
		 * if emptyObject
		 *  @param obj
		 * */
        isEmptyObject : function( obj ){
        	for ( var key in obj ) {
				return false
			}
			
			return true;
        },
        
        hide : function( timeout ){
        	var plugin = this;
            return setTimeout(function() {
                plugin.$el.animate({
                    opacity: 0,
                }, plugin.settings.animationDuration, function() {
                	
                	
                	if( plugin.$el.parent().children().length == 1 ){
                		plugin.$el.parent().remove();
                	}else{
                		plugin.$el.remove();
                	}
                	
                    
                });
            }, timeout || 0);
        }
	});
	
	window.moonToast = function(options) {
        return new moonToastRender(options);
    };

} )( window,document )