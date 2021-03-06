//START AjaxControlToolkit.Compat.Timer.Timer.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />


///////////////////////////////////////////////////////////////////////////////
// Sys.Timer

Sys.Timer = function() {
    Sys.Timer.initializeBase(this);
    
    this._interval = 1000;
    this._enabled = false;
    this._timer = null;
}

Sys.Timer.prototype = {
    get_interval: function() {
        
        return this._interval;
    },
    set_interval: function(value) {
        
        if (this._interval !== value) {
            this._interval = value;
            this.raisePropertyChanged('interval');
            
            if (!this.get_isUpdating() && (this._timer !== null)) {
                this._stopTimer();
                this._startTimer();
            }
        }
    },
    
    get_enabled: function() {
        
        return this._enabled;
    },
    set_enabled: function(value) {
        
        if (value !== this.get_enabled()) {
            this._enabled = value;
            this.raisePropertyChanged('enabled');
            if (!this.get_isUpdating()) {
                if (value) {
                    this._startTimer();
                }
                else {
                    this._stopTimer();
                }
            }
        }
    },

    
    add_tick: function(handler) {
        
        
        this.get_events().addHandler("tick", handler);
    },

    remove_tick: function(handler) {
        
        
        this.get_events().removeHandler("tick", handler);
    },

    dispose: function() {
        this.set_enabled(false);
        this._stopTimer();
        
        Sys.Timer.callBaseMethod(this, 'dispose');
    },
    
    updated: function() {
        Sys.Timer.callBaseMethod(this, 'updated');

        if (this._enabled) {
            this._stopTimer();
            this._startTimer();
        }
    },

    _timerCallback: function() {
        var handler = this.get_events().getHandler("tick");
        if (handler) {
            handler(this, Sys.EventArgs.Empty);
        }
    },

    _startTimer: function() {
        this._timer = window.setInterval(Function.createDelegate(this, this._timerCallback), this._interval);
    },

    _stopTimer: function() {
        window.clearInterval(this._timer);
        this._timer = null;
    }
}

Sys.Timer.descriptor = {
    properties: [   {name: 'interval', type: Number},
                    {name: 'enabled', type: Boolean} ],
    events: [ {name: 'tick'} ]
}

Sys.Timer.registerClass('Sys.Timer', Sys.Component);

//END AjaxControlToolkit.Compat.Timer.Timer.js
//START AjaxControlToolkit.Common.Common.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />


// Add common toolkit scripts here.  To consume the scripts on a control add
// 
//      [RequiredScript(typeof(CommonToolkitScripts))] 
//      public class SomeExtender : ...
// 
// to the controls extender class declaration.


Type.registerNamespace('AjaxControlToolkit');


AjaxControlToolkit.BoxSide = function() {
    /// <summary>
    /// The BoxSide enumeration describes the sides of a DOM element
    /// </summary>
    /// <field name="Top" type="Number" integer="true" static="true" />
    /// <field name="Right" type="Number" integer="true" static="true" />
    /// <field name="Bottom" type="Number" integer="true" static="true" />
    /// <field name="Left" type="Number" integer="true" static="true" />
}
AjaxControlToolkit.BoxSide.prototype = {
    Top : 0,
    Right : 1,
    Bottom : 2,
    Left : 3
}
AjaxControlToolkit.BoxSide.registerEnum("AjaxControlToolkit.BoxSide", false);


AjaxControlToolkit._CommonToolkitScripts = function() {
    /// <summary>
    /// The _CommonToolkitScripts class contains functionality utilized across a number
    /// of controls (but not universally)
    /// </summary>
    /// <remarks>
    /// You should not create new instances of _CommonToolkitScripts.  Instead you should use the shared instance CommonToolkitScripts (or AjaxControlToolkit.CommonToolkitScripts).
    /// </remarks>
}
AjaxControlToolkit._CommonToolkitScripts.prototype = {
    // The order of these lookup tables is directly linked to the BoxSide enum defined above
    _borderStyleNames : ["borderTopStyle","borderRightStyle","borderBottomStyle","borderLeftStyle"],
    _borderWidthNames : ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"],
    _paddingWidthNames : ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    _marginWidthNames : ["marginTop", "marginRight", "marginBottom", "marginLeft"],

    getCurrentStyle : function(element, attribute, defaultValue) {
        /// <summary>
        /// CommonToolkitScripts.getCurrentStyle is used to compute the value of a style attribute on an
        /// element that is currently being displayed.  This is especially useful for scenarios where
        /// several CSS classes and style attributes are merged, or when you need information about the
        /// size of an element (such as its padding or margins) that is not exposed in any other fashion.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Live DOM element to check style of
        /// </param>
        /// <param name="attribute" type="String">
        /// The style attribute's name is expected to be in a camel-cased form that you would use when
        /// accessing a JavaScript property instead of the hyphenated form you would use in a CSS
        /// stylesheet (i.e. it should be "backgroundColor" and not "background-color").
        /// </param>
        /// <param name="defaultValue" type="Object" mayBeNull="true" optional="true">
        /// In the event of a problem (i.e. a null element or an attribute that cannot be found) we
        /// return this object (or null if none if not specified).
        /// </param>
        /// <returns type="Object">
        /// Current style of the element's attribute
        /// </returns>

        var currentValue = null;
        if (element) {
            if (element.currentStyle) {
                currentValue = element.currentStyle[attribute];
            } else if (document.defaultView && document.defaultView.getComputedStyle) {
                var style = document.defaultView.getComputedStyle(element, null);
                if (style) {
                    currentValue = style[attribute];
                }
            }
            
            if (!currentValue && element.style.getPropertyValue) {
                currentValue = element.style.getPropertyValue(attribute);
            }
            else if (!currentValue && element.style.getAttribute) {
                currentValue = element.style.getAttribute(attribute);
            }       
        }
        
        if ((!currentValue || currentValue == "" || typeof(currentValue) === 'undefined')) {
            if (typeof(defaultValue) != 'undefined') {
                currentValue = defaultValue;
            }
            else {
                currentValue = null;
            }
        }   
        return currentValue;  
    },

    getInheritedBackgroundColor : function(element) {
        /// <summary>
        /// CommonToolkitScripts.getInheritedBackgroundColor provides the ability to get the displayed
        /// background-color of an element.  In most cases calling CommonToolkitScripts.getCurrentStyle
        /// won't do the job because it will return "transparent" unless the element has been given a
        /// specific background color.  This function will walk up the element's parents until it finds
        /// a non-transparent color.  If we get all the way to the top of the document or have any other
        /// problem finding a color, we will return the default value '#FFFFFF'.  This function is
        /// especially important when we're using opacity in IE (because ClearType will make text look
        /// horrendous if you fade it with a transparent background color).
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Live DOM element to get the background color of
        /// </param>
        /// <returns type="String">
        /// Background color of the element
        /// </returns>
        
        if (!element) return '#FFFFFF';
        var background = this.getCurrentStyle(element, 'backgroundColor');
        try {
            while (!background || background == '' || background == 'transparent' || background == 'rgba(0, 0, 0, 0)') {
                element = element.parentNode;
                if (!element) {
                    background = '#FFFFFF';
                } else {
                    background = this.getCurrentStyle(element, 'backgroundColor');
                }
            }
        } catch(ex) {
            background = '#FFFFFF';
        }
        return background;
    },

    getLocation : function(element) {
    /// <summary>Gets the coordinates of a DOM element.</summary>
    /// <param name="element" domElement="true"/>
    /// <returns type="Sys.UI.Point">
    ///   A Point object with two fields, x and y, which contain the pixel coordinates of the element.
    /// </returns>

    // workaround for an issue in getLocation where it will compute the location of the document element.
    // this will return an offset if scrolled.
    //
    if (element === document.documentElement) {
        return new Sys.UI.Point(0,0);
    }

    // Workaround for IE6 bug in getLocation (also required patching getBounds - remove that fix when this is removed)
    if (Sys.Browser.agent == Sys.Browser.InternetExplorer && Sys.Browser.version < 7) {
        if (element.window === element || element.nodeType === 9 || !element.getClientRects || !element.getBoundingClientRect) return new Sys.UI.Point(0,0);

        // Get the first bounding rectangle in screen coordinates
        var screenRects = element.getClientRects();
        if (!screenRects || !screenRects.length) {
            return new Sys.UI.Point(0,0);
        }
        var first = screenRects[0];

        // Delta between client coords and screen coords
        var dLeft = 0;
        var dTop = 0;

        var inFrame = false;
        try {
            inFrame = element.ownerDocument.parentWindow.frameElement;
        } catch(ex) {
            // If accessing the frameElement fails, a frame is probably in a different
            // domain than its parent - and we still want to do the calculation below
            inFrame = true;
        }

        // If we're in a frame, get client coordinates too so we can compute the delta
        if (inFrame) {
            // Get the bounding rectangle in client coords
            var clientRect = element.getBoundingClientRect();
            if (!clientRect) {
                return new Sys.UI.Point(0,0);
            }

            // Find the minima in screen coords
            var minLeft = first.left;
            var minTop = first.top;
            for (var i = 1; i < screenRects.length; i++) {
                var r = screenRects[i];
                if (r.left < minLeft) {
                    minLeft = r.left;
                }
                if (r.top < minTop) {
                    minTop = r.top;
                }
            }

            // Compute the delta between screen and client coords
            dLeft = minLeft - clientRect.left;
            dTop = minTop - clientRect.top;
        }

        // Subtract 2px, the border of the viewport (It can be changed in IE6 by applying a border style to the HTML element,
        // but this is not supported by ASP.NET AJAX, and it cannot be changed in IE7.), and also subtract the delta between
        // screen coords and client coords
        var ownerDocument = element.document.documentElement;
        return new Sys.UI.Point(first.left - 2 - dLeft + ownerDocument.scrollLeft, first.top - 2 - dTop + ownerDocument.scrollTop);
    }

    return Sys.UI.DomElement.getLocation(element);
},

    setLocation : function(element, point) {
        /// <summary>
        /// Sets the current location for an element.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="point" type="Object">
        /// Point object (of the form {x,y})
        /// </param>
        /// <remarks>
        /// This method does not attempt to set the positioning mode of an element.
        /// The position is relative from the elements nearest position:relative or
        /// position:absolute element.
        /// </remarks>
        Sys.UI.DomElement.setLocation(element, point.x, point.y);
    },
    
    getContentSize : function(element) {
        /// <summary>
        /// Gets the "content-box" size of an element.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <returns type="Object">
        /// Size of the element (in the form {width,height})
        /// </returns>
        /// <remarks>
        /// The "content-box" is the size of the content area *inside* of the borders and
        /// padding of an element. The "content-box" size does not include the margins around
        /// the element.
        /// </remarks>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        var size = this.getSize(element);
        var borderBox = this.getBorderBox(element);
        var paddingBox = this.getPaddingBox(element);
        return {
            width :  size.width - borderBox.horizontal - paddingBox.horizontal,
            height : size.height - borderBox.vertical - paddingBox.vertical
        }
    },

    getSize : function(element) {
        /// <summary>
        /// Gets the "border-box" size of an element.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <returns type="Object">
        /// Size of the element (in the form {width,height})
        /// </returns>
        /// <remarks>
        /// The "border-box" is the size of the content area *outside* of the borders and
        /// padding of an element.  The "border-box" size does not include the margins around
        /// the element.
        /// </remarks>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        return {
            width:  element.offsetWidth,
            height: element.offsetHeight
        };
    },
    
    setContentSize : function(element, size) {
        /// <summary>
        /// Sets the "content-box" size of an element.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="size" type="Object">
        /// Size of the element (in the form {width,height})
        /// </param>
        /// <remarks>
        /// The "content-box" is the size of the content area *inside* of the borders and
        /// padding of an element. The "content-box" size does not include the margins around
        /// the element.
        /// </remarks>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!size) {
            throw Error.argumentNull('size');
        }
        // FF respects -moz-box-sizing css extension, so adjust the box size for the border-box
        if(this.getCurrentStyle(element, 'MozBoxSizing') == 'border-box' || this.getCurrentStyle(element, 'BoxSizing') == 'border-box') {
            var borderBox = this.getBorderBox(element);
            var paddingBox = this.getPaddingBox(element);
            size = {
                width: size.width + borderBox.horizontal + paddingBox.horizontal,
                height: size.height + borderBox.vertical + paddingBox.vertical
            };
        }
        element.style.width = size.width.toString() + 'px';
        element.style.height = size.height.toString() + 'px';
    },
    
    setSize : function(element, size) {
        /// <summary>
        /// Sets the "border-box" size of an element.
        /// </summary>
        /// <remarks>
        /// The "border-box" is the size of the content area *outside* of the borders and 
        /// padding of an element.  The "border-box" size does not include the margins around
        /// the element.
        /// </remarks>
        /// <param name="element" type="Sys.UI.DomElement">DOM element</param>
        /// <param name="size" type="Object">Size of the element (in the form {width,height})</param>
        /// <returns />
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!size) {
            throw Error.argumentNull('size');
        }
        var borderBox = this.getBorderBox(element);
        var paddingBox = this.getPaddingBox(element);
        var contentSize = {
            width:  size.width - borderBox.horizontal - paddingBox.horizontal,
            height: size.height - borderBox.vertical - paddingBox.vertical
        };
        this.setContentSize(element, contentSize);
    },
    
    getBounds : function(element) {
        /// <summary>Gets the coordinates, width and height of an element.</summary>
        /// <param name="element" domElement="true"/>
        /// <returns type="Sys.UI.Bounds">
        ///   A Bounds object with four fields, x, y, width and height, which contain the pixel coordinates,
        ///   width and height of the element.
        /// </returns>
        /// <remarks>
        ///   Use the CommonToolkitScripts version of getLocation to handle the workaround for IE6.  We can
        ///   remove the below implementation and just call Sys.UI.DomElement.getBounds when the other bug
        ///   is fixed.
        /// </remarks>
        
        var offset = $common.getLocation(element);
        return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);
    }, 
    
    setBounds : function(element, bounds) {
        /// <summary>
        /// Sets the "border-box" bounds of an element
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="bounds" type="Object">
        /// Bounds of the element (of the form {x,y,width,height})
        /// </param>
        /// <remarks>
        /// The "border-box" is the size of the content area *outside* of the borders and
        /// padding of an element.  The "border-box" size does not include the margins around
        /// the element.
        /// </remarks>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if (!bounds) {
            throw Error.argumentNull('bounds');
        }
        this.setSize(element, bounds);
        $common.setLocation(element, bounds);
    },
    
    getClientBounds : function() {
        /// <summary>
        /// Gets the width and height of the browser client window (excluding scrollbars)
        /// </summary>
        /// <returns type="Sys.UI.Bounds">
        /// Browser's client width and height
        /// </returns>

        var clientWidth;
        var clientHeight;
        switch(Sys.Browser.agent) {
            case Sys.Browser.InternetExplorer:
                clientWidth = document.documentElement.clientWidth;
                clientHeight = document.documentElement.clientHeight;
                break;
            case Sys.Browser.Safari:
                clientWidth = window.innerWidth;
                clientHeight = window.innerHeight;
                break;
            case Sys.Browser.Opera:
                clientWidth = Math.min(window.innerWidth, document.body.clientWidth);
                clientHeight = Math.min(window.innerHeight, document.body.clientHeight);
                break;
            default:  // Sys.Browser.Firefox, etc.
                clientWidth = Math.min(window.innerWidth, document.documentElement.clientWidth);
                clientHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
                break;
        }
        return new Sys.UI.Bounds(0, 0, clientWidth, clientHeight);
    },
   
    getMarginBox : function(element) {
        /// <summary>
        /// Gets the entire margin box sizes.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <returns type="Object">
        /// Element's margin box sizes (of the form {top,left,bottom,right,horizontal,vertical})
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getMargin(element, AjaxControlToolkit.BoxSide.Top),
            right: this.getMargin(element, AjaxControlToolkit.BoxSide.Right),
            bottom: this.getMargin(element, AjaxControlToolkit.BoxSide.Bottom),
            left: this.getMargin(element, AjaxControlToolkit.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },
    
    getBorderBox : function(element) {
        /// <summary>
        /// Gets the entire border box sizes.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <returns type="Object">
        /// Element's border box sizes (of the form {top,left,bottom,right,horizontal,vertical})
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Top),
            right: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Right),
            bottom: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Bottom),
            left: this.getBorderWidth(element, AjaxControlToolkit.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },
    
    getPaddingBox : function(element) {
        /// <summary>
        /// Gets the entire padding box sizes.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <returns type="Object">
        /// Element's padding box sizes (of the form {top,left,bottom,right,horizontal,vertical})
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        var box = {
            top: this.getPadding(element, AjaxControlToolkit.BoxSide.Top),
            right: this.getPadding(element, AjaxControlToolkit.BoxSide.Right),
            bottom: this.getPadding(element, AjaxControlToolkit.BoxSide.Bottom),
            left: this.getPadding(element, AjaxControlToolkit.BoxSide.Left)
        };
        box.horizontal = box.left + box.right;
        box.vertical = box.top + box.bottom;
        return box;
    },
    
    isBorderVisible : function(element, boxSide) {
        /// <summary>
        /// Gets whether the current border style for an element on a specific boxSide is not 'none'.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="boxSide" type="AjaxControlToolkit.BoxSide">
        /// Side of the element
        /// </param>
        /// <returns type="Boolean">
        /// Whether the current border style for an element on a specific boxSide is not 'none'.
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));
        }
        var styleName = this._borderStyleNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        return styleValue != "none";
    },
    
    getMargin : function(element, boxSide) {
        /// <summary>
        /// Gets the margin thickness of an element on a specific boxSide.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="boxSide" type="AjaxControlToolkit.BoxSide">
        /// Side of the element
        /// </param>
        /// <returns type="Number" integer="true">
        /// Margin thickness on the element's specified side
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));
        }
        var styleName = this._marginWidthNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        try { return this.parsePadding(styleValue); } catch(ex) { return 0; }
    },

    getBorderWidth : function(element, boxSide) {
        /// <summary>
        /// Gets the border thickness of an element on a specific boxSide.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="boxSide" type="AjaxControlToolkit.BoxSide">
        /// Side of the element
        /// </param>
        /// <returns type="Number" integer="true">
        /// Border thickness on the element's specified side
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));
        }
        if(!this.isBorderVisible(element, boxSide)) {
            return 0;
        }        
        var styleName = this._borderWidthNames[boxSide];    
        var styleValue = this.getCurrentStyle(element, styleName);
        return this.parseBorderWidth(styleValue);
    },
    
    getPadding : function(element, boxSide) {
        /// <summary>
        /// Gets the padding thickness of an element on a specific boxSide.
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// DOM element
        /// </param>
        /// <param name="boxSide" type="AjaxControlToolkit.BoxSide">
        /// Side of the element
        /// </param>
        /// <returns type="Number" integer="true">
        /// Padding on the element's specified side
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        if(boxSide < AjaxControlToolkit.BoxSide.Top || boxSide > AjaxControlToolkit.BoxSide.Left) {
            throw Error.argumentOutOfRange(String.format(Sys.Res.enumInvalidValue, boxSide, 'AjaxControlToolkit.BoxSide'));
        }
        var styleName = this._paddingWidthNames[boxSide];
        var styleValue = this.getCurrentStyle(element, styleName);
        return this.parsePadding(styleValue);
    },
    
    parseBorderWidth : function(borderWidth) {
        /// <summary>
        /// Parses a border-width string into a pixel size
        /// </summary>
        /// <param name="borderWidth" type="String" mayBeNull="true">
        /// Type of border ('thin','medium','thick','inherit',px unit,null,'')
        /// </param>
        /// <returns type="Number" integer="true">
        /// Number of pixels in the border-width
        /// </returns>
        if (!this._borderThicknesses) {
            
            // Populate the borderThicknesses lookup table
            var borderThicknesses = { };
            var div0 = document.createElement('div');
            div0.style.visibility = 'hidden';
            div0.style.position = 'absolute';
            div0.style.fontSize = '1px';
            document.body.appendChild(div0)
            var div1 = document.createElement('div');
            div1.style.height = '0px';
            div1.style.overflow = 'hidden';
            div0.appendChild(div1);
            var base = div0.offsetHeight;
            div1.style.borderTop = 'solid black';
            div1.style.borderTopWidth = 'thin';
            borderThicknesses['thin'] = div0.offsetHeight - base;
            div1.style.borderTopWidth = 'medium';
            borderThicknesses['medium'] = div0.offsetHeight - base;
            div1.style.borderTopWidth = 'thick';
            borderThicknesses['thick'] = div0.offsetHeight - base;
            div0.removeChild(div1);
            document.body.removeChild(div0);
            this._borderThicknesses = borderThicknesses;
        }
        
        if (borderWidth) {
            switch(borderWidth) {
                case 'thin':
                case 'medium':
                case 'thick':
                    return this._borderThicknesses[borderWidth];
                case 'inherit':
                    return 0;
            }
            var unit = this.parseUnit(borderWidth);
            Sys.Debug.assert(unit.type == 'px', String.format(AjaxControlToolkit.Resources.Common_InvalidBorderWidthUnit, unit.type));
            return unit.size;
        }
        return 0;
    },
    
    parsePadding : function(padding) {
        /// <summary>
        /// Parses a padding string into a pixel size
        /// </summary>
        /// <param name="padding" type="String" mayBeNull="true">
        /// Padding to parse ('inherit',px unit,null,'')
        /// </param>
        /// <returns type="Number" integer="true">
        /// Number of pixels in the padding
        /// </returns>
        
        if(padding) {
            if(padding == 'inherit') {
                return 0;
            }
            var unit = this.parseUnit(padding);
            Sys.Debug.assert(unit.type == 'px', String.format(AjaxControlToolkit.Resources.Common_InvalidPaddingUnit, unit.type));
            return unit.size;
        }
        return 0;
    },
    
    parseUnit : function(value) {
        /// <summary>
        /// Parses a unit string into a unit object
        /// </summary>
        /// <param name="value" type="String" mayBeNull="true">
        /// Value to parse (of the form px unit,% unit,em unit,...)
        /// </param>
        /// <returns type="Object">
        /// Parsed unit (of the form {size,type})
        /// </returns>
        
        if (!value) {
            throw Error.argumentNull('value');
        }
        
        value = value.trim().toLowerCase();
        var l = value.length;
        var s = -1;
        for(var i = 0; i < l; i++) {
            var ch = value.substr(i, 1);
            if((ch < '0' || ch > '9') && ch != '-' && ch != '.' && ch != ',') {
                break;
            }
            s = i;
        }
        if(s == -1) {
            throw Error.create(AjaxControlToolkit.Resources.Common_UnitHasNoDigits);
        }
        var type;
        var size;
        if(s < (l - 1)) {
            type = value.substring(s + 1).trim();
        } else {
            type = 'px';
        }
        size = parseFloat(value.substr(0, s + 1));
        if(type == 'px') {
            size = Math.floor(size);
        }
        return { 
            size: size,
            type: type
        };
    },
    
    getElementOpacity : function(element) {
        /// <summary>
        /// Get the element's opacity
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <returns type="Number">
        /// Opacity of the element
        /// </returns>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        
        var hasOpacity = false;
        var opacity;
        
        if (element.filters) {
            var filters = element.filters;
            if (filters.length !== 0) {
                var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
                if (alphaFilter) {
                    opacity = alphaFilter.opacity / 100.0;
                    hasOpacity = true;
                }
            }
        }
        else {
            opacity = this.getCurrentStyle(element, 'opacity', 1);
            hasOpacity = true;
        }
        
        if (hasOpacity === false) {
            return 1.0;
        }
        return parseFloat(opacity);
    },

    setElementOpacity : function(element, value) {
        /// <summary>
        /// Set the element's opacity
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <param name="value" type="Number">
        /// Opacity of the element
        /// </param>
        
        if (!element) {
            throw Error.argumentNull('element');
        }
        
        if (element.filters) {
            var filters = element.filters;
            var createFilter = true;
            if (filters.length !== 0) {
                var alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
                if (alphaFilter) {
                    createFilter = false;
                    alphaFilter.opacity = value * 100;
                }
            }
            if (createFilter) {
                element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (value * 100) + ')';
            }
        }
        else {
            element.style.opacity = value;
        }
    },
    
    getVisible : function(element) {
        /// <summary>
        /// Check if an element is visible
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <returns type="Boolean" mayBeNull="false">
        /// True if the element is visible, false otherwise
        /// </returns>
        
        // Note: reference to CommonToolkitScripts must be left intact (i.e. don't
        // replace with 'this') because this function will be aliased
        
        return (element &&
                ("none" != $common.getCurrentStyle(element, "display")) &&
                ("hidden" != $common.getCurrentStyle(element, "visibility")));
    },
    
    setVisible : function(element, value) {
        /// <summary>
        /// Check if an element is visible
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" domElement="true">
        /// Element
        /// </param>
        /// <param name="value" type="Boolean" mayBeNull="false">
        /// True to make the element visible, false to hide it
        /// </param>
        
        // Note: reference to CommonToolkitScripts must be left intact (i.e. don't
        // replace with 'this') because this function will be aliased
        
        if (element && value != $common.getVisible(element)) {
            if (value) {
                if (element.style.removeAttribute) {
                    element.style.removeAttribute("display");
                } else {
                   element.style.removeProperty("display");
                }
            } else {
                element.style.display = 'none';
            }
            element.style.visibility = value ? 'visible' : 'hidden';
        }
    },
    
    resolveFunction : function(value) {
        /// <summary>
        /// Returns a function reference that corresponds to the provided value
        /// </summary>
        /// <param name="value" type="Object">
        /// The value can either be a Function, the name of a function (that can be found using window['name']),
        /// or an expression that evaluates to a function.
        /// </param>
        /// <returns type="Function">
        /// Reference to the function, or null if not found
        /// </returns>
        
        if (value) {
            if (value instanceof Function) {
                return value;
            } else if (String.isInstanceOfType(value) && value.length > 0) {
                var func;
                if ((func = window[value]) instanceof Function) {
                    return func;
                } else if ((func = eval(value)) instanceof Function) {
                    return func;
                }
            }
        }
        return null;
    },

    addCssClasses : function(element, classNames) {
        /// <summary>
        /// Adds multiple css classes to a DomElement
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to modify</param>
        /// <param name="classNames" type="Array">The class names to add</param>
        
        for(var i = 0; i < classNames.length; i++) {
            Sys.UI.DomElement.addCssClass(element, classNames[i]);
        }
    },
    removeCssClasses : function(element, classNames) {
        /// <summary>
        /// Removes multiple css classes to a DomElement
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to modify</param>
        /// <param name="classNames" type="Array">The class names to remove</param>
        
        for(var i = 0; i < classNames.length; i++) {
            Sys.UI.DomElement.removeCssClass(element, classNames[i]);
        }
    },
    setStyle : function(element, style) {
        /// <summary>
        /// Sets the style of the element using the supplied style template object
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to modify</param>
        /// <param name="style" type="Object">The template</param>

        $common.applyProperties(element.style, style);
    },
    removeHandlers : function(element, events) {
        /// <summary>
        /// Removes a set of event handlers from an element
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to modify</param>
        /// <param name="events" type="Object">The template object that contains event names and delegates</param>
        /// <remarks>
        /// This is NOT the same as $clearHandlers which removes all delegates from a DomElement.  This rather removes select delegates 
        /// from a specified element and has a matching signature as $addHandlers
        /// </remarks>
        for (var name in events) {
            $removeHandler(element, name, events[name]);
        }
    },
    
    overlaps : function(r1, r2) {
        /// <summary>
        /// Determine if two rectangles overlap
        /// </summary>
        /// <param name="r1" type="Object">
        /// Rectangle
        /// </param>
        /// <param name="r2" type="Object">
        /// Rectangle
        /// </param>
        /// <returns type="Boolean">
        /// True if the rectangles overlap, false otherwise
        /// </returns>
        
         return r1.x < (r2.x + r2.width)
                && r2.x < (r1.x + r1.width)
                && r1.y < (r2.y + r2.height)
                && r2.y < (r1.y + r1.height);
    },
    
    containsPoint : function(rect, x, y) {
        /// <summary>
        /// Tests whether a point (x,y) is contained within a rectangle
        /// </summary>
        /// <param name="rect" type="Object">The rectangle</param>
        /// <param name="x" type="Number">The x coordinate of the point</param>
        /// <param name="y" type="Number">The y coordinate of the point</param>
        
        return x >= rect.x && x < (rect.x + rect.width) && y >= rect.y && y < (rect.y + rect.height);
    },

    isKeyDigit : function(keyCode) { 
        /// <summary>
        /// Gets whether the supplied key-code is a digit
        /// </summary>
        /// <param name="keyCode" type="Number" integer="true">The key code of the event (from Sys.UI.DomEvent)</param>
        /// <returns type="Boolean" />

        return (0x30 <= keyCode && keyCode <= 0x39); 
    },
    
    isKeyNavigation : function(keyCode) { 
        /// <summary>
        /// Gets whether the supplied key-code is a navigation key
        /// </summary>
        /// <param name="keyCode" type="Number" integer="true">The key code of the event (from Sys.UI.DomEvent)</param>
        /// <returns type="Boolean" />

        return (Sys.UI.Key.left <= keyCode && keyCode <= Sys.UI.Key.down); 
    },
    
    padLeft : function(text, size, ch, truncate) { 
        /// <summary>
        /// Pads the left hand side of the supplied text with the specified pad character up to the requested size
        /// </summary>
        /// <param name="text" type="String">The text to pad</param>
        /// <param name="size" type="Number" integer="true" optional="true">The size to pad the text (default is 2)</param>
        /// <param name="ch" type="String" optional="true">The single character to use as the pad character (default is ' ')</param>
        /// <param name="truncate" type="Boolean" optional="true">Whether to truncate the text to size (default is false)</param>
        
        return $common._pad(text, size || 2, ch || ' ', 'l', truncate || false); 
    },
    
    padRight : function(text, size, ch, truncate) { 
        /// <summary>
        /// Pads the right hand side of the supplied text with the specified pad character up to the requested size
        /// </summary>
        /// <param name="text" type="String">The text to pad</param>
        /// <param name="size" type="Number" integer="true" optional="true">The size to pad the text (default is 2)</param>
        /// <param name="ch" type="String" optional="true">The single character to use as the pad character (default is ' ')</param>
        /// <param name="truncate" type="Boolean" optional="true">Whether to truncate the text to size (default is false)</param>

        return $common._pad(text, size || 2, ch || ' ', 'r', truncate || false); 
    },
    
    _pad : function(text, size, ch, side, truncate) {
        /// <summary>
        /// Pads supplied text with the specified pad character up to the requested size
        /// </summary>
        /// <param name="text" type="String">The text to pad</param>
        /// <param name="size" type="Number" integer="true">The size to pad the text</param>
        /// <param name="ch" type="String">The single character to use as the pad character</param>
        /// <param name="side" type="String">Either 'l' or 'r' to siginfy whether to pad the Left or Right side respectively</param>
        /// <param name="truncate" type="Boolean">Whether to truncate the text to size</param>

        text = text.toString();
        var length = text.length;
        var builder = new Sys.StringBuilder();
        if (side == 'r') {
            builder.append(text);
        } 
        while (length < size) {
            builder.append(ch);
            length++;
        }
        if (side == 'l') {
            builder.append(text);
        }
        var result = builder.toString();
        if (truncate && result.length > size) {
            if (side == 'l') {
                result = result.substr(result.length - size, size);
            } else {
                result = result.substr(0, size);
            }
        }
        return result;
    },
    
    __DOMEvents : {
        focusin : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focusin", true, false, window, 1); } },
        focusout : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focusout", true, false, window, 1); } },
        activate : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("activate", true, true, window, 1); } },
        focus : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("focus", false, false, window, 1); } },
        blur : { eventGroup : "UIEvents", init : function(e, p) { e.initUIEvent("blur", false, false, window, 1); } },
        click : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("click", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        dblclick : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("click", true, true, window, 2, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mousedown : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousedown", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseup : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mouseup", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseover : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mouseover", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mousemove : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        mouseout : { eventGroup : "MouseEvents", init : function(e, p) { e.initMouseEvent("mousemove", true, true, window, 1, p.screenX || 0, p.screenY || 0, p.clientX || 0, p.clientY || 0, p.ctrlKey || false, p.altKey || false, p.shiftKey || false, p.metaKey || false, p.button || 0, p.relatedTarget || null); } },
        load : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("load", false, false); } },
        unload : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("unload", false, false); } },
        select : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("select", true, false); } },
        change : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("change", true, false); } },
        submit : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("submit", true, true); } },
        reset : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("reset", true, false); } },
        resize : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("resize", true, false); } },
        scroll : { eventGroup : "HTMLEvents", init : function(e, p) { e.initEvent("scroll", true, false); } }
    },
    
    tryFireRawEvent : function(element, rawEvent) {
        /// <summary>
        /// Attempts to fire a raw DOM event on an element
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to fire the event</param>
        /// <param name="rawEvent" type="Object">The raw DOM event object to fire. Must not be Sys.UI.DomEvent</param>
        /// <returns type="Boolean">True if the event was successfully fired, otherwise false</returns>
        
        try {
            if (element.fireEvent) {
                element.fireEvent("on" + rawEvent.type, rawEvent);
                return true;
            } else if (element.dispatchEvent) {
                element.dispatchEvent(rawEvent);
                return true;
            }
        } catch (e) {
        }
        return false;
    },    

    tryFireEvent : function(element, eventName, properties) {
        /// <summary>
        /// Attempts to fire a DOM event on an element
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to fire the event</param>
        /// <param name="eventName" type="String">The name of the event to fire (without an 'on' prefix)</param>
        /// <param name="properties" type="Object">Properties to add to the event</param>
        /// <returns type="Boolean">True if the event was successfully fired, otherwise false</returns>
        
        try {
            if (document.createEventObject) {
                var e = document.createEventObject();
                $common.applyProperties(e, properties || {});
                element.fireEvent("on" + eventName, e);
                return true;
            } else if (document.createEvent) {
                var def = $common.__DOMEvents[eventName];
                if (def) {
                    var e = document.createEvent(def.eventGroup);
                    def.init(e, properties || {});
                    element.dispatchEvent(e);
                    return true;
                }
            }
        } catch (e) {
        }
        return false;
    },

    wrapElement : function(innerElement, newOuterElement, newInnerParentElement) {
        /// <summary>
        /// Wraps an inner element with a new outer element at the same DOM location as the inner element
        /// </summary>
        /// <param name="innerElement" type="Sys.UI.DomElement">The element to be wrapped</param>
        /// <param name="newOuterElement" type="Sys.UI.DomElement">The new parent for the element</param>
        /// <returns />
        
        var parent = innerElement.parentNode;
        parent.replaceChild(newOuterElement, innerElement);        
        (newInnerParentElement || newOuterElement).appendChild(innerElement);
    },

    unwrapElement : function(innerElement, oldOuterElement) {
        /// <summary>
        /// Unwraps an inner element from an outer element at the same DOM location as the outer element
        /// </summary>
        /// <param name="innerElement" type="Sys.UI.DomElement">The element to be wrapped</param>
        /// <param name="newOuterElement" type="Sys.UI.DomElement">The new parent for the element</param>
        /// <returns />

        var parent = oldOuterElement.parentNode;
        if (parent != null) {
            $common.removeElement(innerElement);
            parent.replaceChild(innerElement, oldOuterElement);
        }
    },
    
    removeElement : function(element) {
        /// <summary>
        /// Removes an element from the DOM tree
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement">The element to be removed</param>
        /// <returns />

        var parent = element.parentNode;
        if (parent != null) {
            parent.removeChild(element);
        }
    },
 
    applyProperties : function(target, properties) {
        /// <summary>
        /// Quick utility method to copy properties from a template object to a target object
        /// </summary>
        /// <param name="target" type="Object">The object to apply to</param>
        /// <param name="properties" type="Object">The template to copy values from</param>
        
        for (var p in properties) {
            var pv = properties[p];
            if (pv != null && Object.getType(pv)===Object) {
                var tv = target[p];
                $common.applyProperties(tv, pv);
            } else {
                target[p] = pv;
            }
        }
    },
        
    createElementFromTemplate : function(template, appendToParent, nameTable) {
        /// <summary>
        /// Creates an element for the current document based on a template object
        /// </summary>
        /// <param name="template" type="Object">The template from which to create the element</param>
        /// <param name="appendToParent" type="Sys.UI.DomElement" optional="true" mayBeNull="true">A DomElement under which to append this element</param>
        /// <param name="nameTable" type="Object" optional="true" mayBeNull="true">An object to use as the storage for the element using template.name as the key</param>
        /// <returns type="Sys.UI.DomElement" />
        /// <remarks>
        /// This method is useful if you find yourself using the same or similar DomElement constructions throughout a class.  You can even set the templates
        /// as static properties for a type to cut down on overhead.  This method is often called with a JSON style template:
        /// <code>
        /// var elt = $common.createElementFromTemplate({
        ///     nodeName : "div",
        ///     properties : {
        ///         style : {
        ///             height : "100px",
        ///             width : "100px",
        ///             backgroundColor : "white"
        ///         },
        ///         expandoAttribute : "foo"
        ///     },
        ///     events : {
        ///         click : function() { alert("foo"); },
        ///         mouseover : function() { elt.backgroundColor = "silver"; },
        ///         mouseout : function() { elt.backgroundColor = "white"; }
        ///     },
        ///     cssClasses : [ "class0", "class1" ],
        ///     visible : true,
        ///     opacity : .5
        /// }, someParent);
        /// </code>
        /// </remarks>
        
        // if we wish to override the name table we do so here
        if (typeof(template.nameTable)!='undefined') {
            var newNameTable = template.nameTable;
            if (String.isInstanceOfType(newNameTable)) {
                newNameTable = nameTable[newNameTable];
            }
            if (newNameTable != null) {
                nameTable = newNameTable;
            }
        }
        
        // get a name for the element in the nameTable
        var elementName = null;
        if (typeof(template.name)!=='undefined') {
            elementName = template.name;
        }
        
        // create or acquire the element
        var elt = document.createElement(template.nodeName);
        
        // if our element is named, add it to the name table
        if (typeof(template.name)!=='undefined' && nameTable) {
            nameTable[template.name] = elt;
        }
        
        // if we wish to supply a default parent we do so here
        if (typeof(template.parent)!=='undefined' && appendToParent == null) {
            var newParent = template.parent;
            if (String.isInstanceOfType(newParent)) {
                newParent = nameTable[newParent];
            }
            if (newParent != null) {
                appendToParent = newParent;
            }
        }
        
        // properties are applied as expando values to the element
        if (typeof(template.properties)!=='undefined' && template.properties != null) {
            $common.applyProperties(elt, template.properties);
        }
        
        // css classes are added to the element's className property
        if (typeof(template.cssClasses)!=='undefined' && template.cssClasses != null) {
            $common.addCssClasses(elt, template.cssClasses);
        }
        
        // events are added to the dom element using $addHandlers
        if (typeof(template.events)!=='undefined' && template.events != null) {
            $addHandlers(elt, template.events);
        }
        
        // if the element is visible or not its visibility is set
        if (typeof(template.visible)!=='undefined' && template.visible != null) {
            this.setVisible(elt, template.visible);
        }
        
        // if we have an appendToParent we will now append to it
        if (appendToParent) {
            appendToParent.appendChild(elt);
        }

        // if we have opacity, apply it
        if (typeof(template.opacity)!=='undefined' && template.opacity != null) {
            $common.setElementOpacity(elt, template.opacity);
        }
        
        // if we have child templates, process them
        if (typeof(template.children)!=='undefined' && template.children != null) {
            for (var i = 0; i < template.children.length; i++) {
                var subtemplate = template.children[i];
                $common.createElementFromTemplate(subtemplate, elt, nameTable);
            }
        }
        
        // if we have a content presenter for the element get it (the element itself is the default presenter for content)
        var contentPresenter = elt;
        if (typeof(template.contentPresenter)!=='undefined' && template.contentPresenter != null) {
            contentPresenter = nameTable[contentPresenter];
        }
        
        // if we have content, add it
        if (typeof(template.content)!=='undefined' && template.content != null) {
            var content = template.content;
            if (String.isInstanceOfType(content)) {
                content = nameTable[content];
            }
            if (content.parentNode) {
                $common.wrapElement(content, elt, contentPresenter);
            } else {
                contentPresenter.appendChild(content);
            }
        }
        
        // return the created element
        return elt;
    },
    
    prepareHiddenElementForATDeviceUpdate : function () {
        /// <summary>
        /// JAWS, an Assistive Technology device responds to updates to form elements 
        /// and refreshes its document buffer to what is showing live
        /// in the browser. To ensure that Toolkit controls that make XmlHttpRequests to
        /// retrieve content are useful to users with visual disabilities, we update a
        /// hidden form element to ensure that JAWS conveys what is in
        /// the browser. See this article for more details: 
        /// http://juicystudio.com/article/improving-ajax-applications-for-jaws-users.php
        /// This method creates a hidden input on the screen for any page that uses a Toolkit
        /// control that will perform an XmlHttpRequest.
        /// </summary>   
        var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');
        if (!objHidden) {
            var objHidden = document.createElement('input');
            objHidden.setAttribute('type', 'hidden');
            objHidden.setAttribute('value', '1');
            objHidden.setAttribute('id', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');
            objHidden.setAttribute('name', 'hiddenInputToUpdateATBuffer_CommonToolkitScripts');
            if ( document.forms[0] ) {
                document.forms[0].appendChild(objHidden);
            }
        }
    },
    
    updateFormToRefreshATDeviceBuffer : function () {
        /// <summary>
        /// Updates the hidden buffer to ensure that the latest document stream is picked up
        /// by the screen reader.
        /// </summary>
        var objHidden = document.getElementById('hiddenInputToUpdateATBuffer_CommonToolkitScripts');

        if (objHidden) {
            if (objHidden.getAttribute('value') == '1') {
                objHidden.setAttribute('value', '0');
            } else {
                objHidden.setAttribute('value', '1');
            }
        }
    }
}

// Create the singleton instance of the CommonToolkitScripts
var CommonToolkitScripts = AjaxControlToolkit.CommonToolkitScripts = new AjaxControlToolkit._CommonToolkitScripts();
var $common = CommonToolkitScripts;

// Alias functions that were moved from BlockingScripts into Common
Sys.UI.DomElement.getVisible = $common.getVisible;
Sys.UI.DomElement.setVisible = $common.setVisible;
Sys.UI.Control.overlaps = $common.overlaps;

AjaxControlToolkit._DomUtility = function() {
    /// <summary>
    /// Utility functions for manipulating the DOM
    /// </summary>
}
AjaxControlToolkit._DomUtility.prototype = {
    isDescendant : function(ancestor, descendant) {
        /// <summary>
        /// Whether the specified element is a descendant of the ancestor
        /// </summary>
        /// <param name="ancestor" type="Sys.UI.DomElement">Ancestor node</param>
        /// <param name="descendant" type="Sys.UI.DomElement">Possible descendant node</param>
        /// <returns type="Boolean" />
        
        for (var n = descendant.parentNode; n != null; n = n.parentNode) {
            if (n == ancestor) return true;
        }
        return false;
    },
    isDescendantOrSelf : function(ancestor, descendant) {
        /// <summary>
        /// Whether the specified element is a descendant of the ancestor or the same as the ancestor
        /// </summary>
        /// <param name="ancestor" type="Sys.UI.DomElement">Ancestor node</param>
        /// <param name="descendant" type="Sys.UI.DomElement">Possible descendant node</param>
        /// <returns type="Boolean" />

        if (ancestor === descendant) 
            return true;
        return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);
    },
    isAncestor : function(descendant, ancestor) {
        /// <summary>
        /// Whether the specified element is an ancestor of the descendant
        /// </summary>
        /// <param name="descendant" type="Sys.UI.DomElement">Descendant node</param>
        /// <param name="ancestor" type="Sys.UI.DomElement">Possible ancestor node</param>
        /// <returns type="Boolean" />

        return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);
    },
    isAncestorOrSelf : function(descendant, ancestor) {
        /// <summary>
        /// Whether the specified element is an ancestor of the descendant or the same as the descendant
        /// </summary>
        /// <param name="descendant" type="Sys.UI.DomElement">Descendant node</param>
        /// <param name="ancestor" type="Sys.UI.DomElement">Possible ancestor node</param>
        /// <returns type="Boolean" />
        
        if (descendant === ancestor)
            return true;
            
        return AjaxControlToolkit.DomUtility.isDescendant(ancestor, descendant);
    },
    isSibling : function(self, sibling) {
        /// <summary>
        /// Whether the specified element is a sibling of the self element
        /// </summary>
        /// <param name="self" type="Sys.UI.DomElement">Self node</param>
        /// <param name="sibling" type="Sys.UI.DomElement">Possible sibling node</param>
        /// <returns type="Boolean" />
        
        var parent = self.parentNode;
        for (var i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i] == sibling) return true;
        }
        return false;
    }
}
AjaxControlToolkit._DomUtility.registerClass("AjaxControlToolkit._DomUtility");
AjaxControlToolkit.DomUtility = new AjaxControlToolkit._DomUtility();


AjaxControlToolkit.TextBoxWrapper = function(element) {
    /// <summary>
    /// Class that wraps a TextBox (INPUT type="text") to abstract-out the
    /// presence of a watermark (which may be visible to the user but which
    /// should never be read by script.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// The DOM element the behavior is associated with
    /// </param>
    AjaxControlToolkit.TextBoxWrapper.initializeBase(this, [element]);
    this._current = element.value;
    this._watermark = null;
    this._isWatermarked = false;
}

AjaxControlToolkit.TextBoxWrapper.prototype = {

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        this.get_element().AjaxControlToolkitTextBoxWrapper = null;
        AjaxControlToolkit.TextBoxWrapper.callBaseMethod(this, 'dispose');
    },

    get_Current : function() {
        /// <value type="String">
        /// Current value actually in the TextBox (i.e., TextBox.value)
        /// </value>
        this._current = this.get_element().value;
        return this._current;
    },
    set_Current : function(value) {
        this._current = value;
        this._updateElement();
    },

    get_Value : function() {
        /// <value type="String">
        /// Conceptual "value" of the TextBox - its contents if no watermark is present
        /// or "" if one is
        /// </value>
        if (this.get_IsWatermarked()) {
            return "";
        } else {
            return this.get_Current();
        }
    },
    set_Value : function(text) {
        this.set_Current(text);
        if (!text || (0 == text.length)) {
            if (null != this._watermark) {
                this.set_IsWatermarked(true);
            }
        } else {
            this.set_IsWatermarked(false);
        }
    },

    get_Watermark : function() {
        /// <value type="String">
        /// Text of the watermark for the TextBox
        /// </value>
        return this._watermark;
    },
    set_Watermark : function(value) {
        this._watermark = value;
        this._updateElement();
    },

    get_IsWatermarked : function() {
        /// <value type="Boolean">
        /// true iff the TextBox is watermarked
        /// </value>
        return this._isWatermarked;
    },
    set_IsWatermarked : function(isWatermarked) {
        if (this._isWatermarked != isWatermarked) {
            this._isWatermarked = isWatermarked;
            this._updateElement();
            this._raiseWatermarkChanged();
        }
    },

    _updateElement : function() {
        /// <summary>
        /// Updates the actual contents of the TextBox according to what should be there
        /// </summary>
        var element = this.get_element();
        if (this._isWatermarked) {
            if (element.value != this._watermark) {
                element.value = this._watermark;
            }
        } else {
            if (element.value != this._current) {
                element.value = this._current;
            }
        }
    },

    add_WatermarkChanged : function(handler) {
        /// <summary>
        /// Adds a handler for the WatermarkChanged event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("WatermarkChanged", handler);
    },
    remove_WatermarkChanged : function(handler) {
        /// <summary>
        /// Removes a handler for the WatermarkChanged event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("WatermarkChanged", handler);
    },
    _raiseWatermarkChanged : function() {
        /// <summary>
        /// Raises the WatermarkChanged event
        /// </summary>
        var onWatermarkChangedHandler = this.get_events().getHandler("WatermarkChanged");
        if (onWatermarkChangedHandler) {
            onWatermarkChangedHandler(this, Sys.EventArgs.Empty);
        }
    }
}
AjaxControlToolkit.TextBoxWrapper.get_Wrapper = function(element) {
    /// <summary>
    /// Gets (creating one if necessary) the TextBoxWrapper for the specified TextBox
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// TextBox for which to get the wrapper
    /// </param>
    /// <returns type="AjaxControlToolkit.TextBoxWrapper">
    /// TextBoxWrapper instance
    /// </returns>
    if (null == element.AjaxControlToolkitTextBoxWrapper) {
        element.AjaxControlToolkitTextBoxWrapper = new AjaxControlToolkit.TextBoxWrapper(element);
    }
    return element.AjaxControlToolkitTextBoxWrapper;
}
AjaxControlToolkit.TextBoxWrapper.registerClass('AjaxControlToolkit.TextBoxWrapper', Sys.UI.Behavior);

AjaxControlToolkit.TextBoxWrapper.validatorGetValue = function(id) {
    /// <summary>
    /// Wrapper for ASP.NET's validatorGetValue to return the value from the wrapper if present
    /// </summary>
    /// <param name="id" type="String">
    /// id of the element
    /// </param>
    /// <returns type="Object">
    /// Value from the wrapper or result of original ValidatorGetValue
    /// </returns>
    var control = $get(id);
    if (control && control.AjaxControlToolkitTextBoxWrapper) {
        return control.AjaxControlToolkitTextBoxWrapper.get_Value();
    }
    return AjaxControlToolkit.TextBoxWrapper._originalValidatorGetValue(id);
}

// Wrap ASP.NET's ValidatorGetValue with AjaxControlToolkit.TextBoxWrapper.validatorGetValue
// to make validators work properly with watermarked TextBoxes
if (typeof(ValidatorGetValue) == 'function') {
    AjaxControlToolkit.TextBoxWrapper._originalValidatorGetValue = ValidatorGetValue;
    ValidatorGetValue = AjaxControlToolkit.TextBoxWrapper.validatorGetValue;
}


// Temporary fix null reference bug in Sys.CultureInfo._getAbbrMonthIndex
if (Sys.CultureInfo.prototype._getAbbrMonthIndex) {
    try {
        Sys.CultureInfo.prototype._getAbbrMonthIndex('');
    } catch(ex) {
        Sys.CultureInfo.prototype._getAbbrMonthIndex = function(value) {
            if (!this._upperAbbrMonths) {
                this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
            }
            return Array.indexOf(this._upperAbbrMonths, this._toUpper(value));
        }
        Sys.CultureInfo.CurrentCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;
        Sys.CultureInfo.InvariantCulture._getAbbrMonthIndex = Sys.CultureInfo.prototype._getAbbrMonthIndex;
    }
}

//END AjaxControlToolkit.Common.Common.js
//START AjaxControlToolkit.Animation.Animations.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Common/Common.js" />


Type.registerNamespace('AjaxControlToolkit.Animation');

// Create an alias for the namespace to save 25 chars each time it's used since
// this is a very long script and will take awhile to download
var $AA = AjaxControlToolkit.Animation;

$AA.registerAnimation = function(name, type) {
    /// <summary>
    /// Register an animation with the AJAX Control Toolkit animation framework. This serves a dual purpose:
    /// 1) to add standard utility methods to the animation type (such as a <code>play</code> method that creates
    /// an animation, plays it, and disposes it when the animation is over), and 2) to associate a name with the
    /// type that will be used when creating animations from a JSON description.  This method can also be called
    /// by other animation libraries to seamlessly interoperate with the AJAX Control Toolkit's animation
    /// framework.
    /// </summary>
    /// <param name="name" type="String">
    /// Name of the animation that will be used as the XML tag name in the XML animation description.  It
    /// should be a valid XML tag (i.e. an alpha-numeric sequence with no spaces, special characters, etc.).
    /// </param>
    /// <param name="type" type="Type">
    /// The type of the new animation must inherit from <see cref="AjaxControlToolkit.Animation.Animation" />.
    /// </param>
    /// <returns />

    // Make sure the type inherits from AjaxControlToolkit.Animation.Animation
    if (type && ((type === $AA.Animation) || (type.inheritsFrom && type.inheritsFrom($AA.Animation)))) {
        // We'll store the animation name/type mapping in a "static" object off of
        // AjaxControlToolkit.Animation.  If this __animations object hasn't been
        // created yet, demand create it on the first registration.
        if (!$AA.__animations) {
            $AA.__animations = { };
        }
        
        // Add the current type to the collection of animations
        $AA.__animations[name.toLowerCase()] = type;
        
        // Add a play function that will make it very easy to create, play, and
        // dispose of an animation.  This is effectively a "static" function on
        // each animation and will take the same parameters as that animation's
        // constructor.
        type.play = function() {
            /// <summary>
            /// Create an animation, play it immediately, and dispose it when finished.
            /// </summary>
            /// <param parameterArray="true" elementType="Object">
            /// The play function takes the same parameters as the type's constructor
            /// </param>
            /// <returns />
        
            // Create and initialize a new animation of the right type and pass in
            // any arguments given to the play function
            var animation = new type();
            type.apply(animation, arguments);
            animation.initialize();
            
            // Add an event handler to dispose the animation when it's finished
            var handler = Function.createDelegate(animation,
                function() {
                    /// <summary>
                    /// Dispose the animation after playing
                    /// </summary>
                    /// <returns />
                    animation.remove_ended(handler);
                    handler = null;
                    animation.dispose();
                });
            animation.add_ended(handler);
            
            // Once the animation has been created and initialized, play it and
            // dispose it as soon as it's finished
            animation.play();            
        }
    } else {
        // Raise an error if someone registers an animation that doesn't inherit
        // from our base Animation class
        throw Error.argumentType('type', type, $AA.Animation, AjaxControlToolkit.Resources.Animation_InvalidBaseType);
    }
}

$AA.buildAnimation = function(json, defaultTarget) {
    /// <summary>
    /// The <code>buildAnimation</code> function is used to turn a JSON animation description
    /// into an actual animation object that can be played.
    /// </summary>
    /// <param name="json" type="String" mayBeNull="true">
    /// JSON description of the animation in the format expected by createAnimation
    /// </param>
    /// <param name="defaultTarget" type="Sys.UI.DomElement" mayBeNull="true" domElement="true">
    /// Target of the animation if none is specified in the JSON description.  The semantics of
    /// target assignment are provided in more detail in createAnimation.
    /// </param>
    /// <returns type="AjaxControlToolkit.Animation.Animation" mayBeNull="true">
    /// Animation created from the JSON description
    /// </returns>
    
    // Ensure we have a description to create an animation with
    if (!json || json === '') {
        return null;
    }

    // "Parse" the JSON so we can easily manipulate it
    // (we don't wrap it in a try/catch when debugging to raise any errors)
    var obj;
    json = '(' + json + ')';
    if (! Sys.Debug.isDebug) {
        try { obj = Sys.Serialization.JavaScriptSerializer.deserialize(json); } catch (ex) { } 
    } else {
        obj = Sys.Serialization.JavaScriptSerializer.deserialize(json);
    }
    
    // Create a new instance of the animation
    return $AA.createAnimation(obj, defaultTarget);    
}

$AA.createAnimation = function(obj, defaultTarget) {
    /// <summary>
    /// The <code>createAnimation</code> function builds a new
    /// <see cref="AjaxControlToolkit.Animation.Animation" /> instance from an object
    /// that describes it.
    /// </summary>
    /// <param name="obj" type="Object">
    /// The object provides a description of the animation to be be generated in
    /// a very specific format. It has two special properties: <code>AnimationName</code>
    /// and <code>AnimationChildren</code>.  The <code>AnimationName</code> is required
    /// and used to find the type of animation to create (this name should map to
    /// one of the animation names supplied to <code>registerAnimation</code>).  The
    /// <code>AnimationChildren</code> property supplies an optional array for
    /// animations that use child animations (such as
    /// <see cref="AjaxControlToolkit.Animation.ParallelAnimation" /> and
    /// <see cref="AjaxControlToolkit.Animation.SequenceAnimation" />). The elements of
    /// the <code>AnimationChildren</code> array are valid
    /// <see cref="AjaxControlToolkit.Animation.Animation" /> objects that meet these same
    /// requirements.  In order for an animation to support child animations, it must
    /// derive from the <see cref="AjaxControlToolkit.Animation.ParentAnimation" /> class
    /// which provides common methods like <code>add</code>, <code>clear</code>, etc. The
    /// remaining properties of the object are used to set parameters specific to the type
    /// of animation being created (e.g. <code>duration</code>, <code>minimumOpacity</code>,
    /// <code>startValue</code>, etc.) and should have a corresponding property on the
    /// animation.  You can also assign an arbitrary JavaScript expression to any property
    /// by adding 'Script' to the end of its name (i.e., Height="70" can be replaced by
    /// HeightScript="$get('myElement').offsetHeight") and have the property set to the
    /// result of evaluating the expression before the animation is played each time.
    /// </param>
    /// <param name="defaultTarget" type="Sys.UI.DomElement" mayBeNull="true" domElement="true">
    /// The function also takes a <code>defaultTarget</code> parameter that is used as the
    /// target of the animation if the object does not specify one.  This parameter should be
    /// an instance of <see cref="Sys.UI.DomElement" /> and not just the name of an element.
    /// </param>
    /// <returns type="AjaxControlToolkit.Animation.Animation">
    /// <see cref="AjaxControlToolkit.Animation.Animation" /> created from the description
    /// </returns>
    /// <remarks>
    /// Exceptions are thrown when the <code>AnimationName</code> cannot be found.  Also,
    /// any exceptions raised by setting properties or providing properties with invalid
    /// names will only be raised when debugging.
    /// </remarks>

    // Create a default instance of the animation by looking up the AnimationName
    // in the global __animations object.
    if (!obj || !obj.AnimationName) {
        throw Error.argument('obj', AjaxControlToolkit.Resources.Animation_MissingAnimationName);
    }
    var type = $AA.__animations[obj.AnimationName.toLowerCase()];
    if (!type) {
        throw Error.argument('type', String.format(AjaxControlToolkit.Resources.Animation_UknownAnimationName, obj.AnimationName));
    }
    var animation = new type();
    
    // Set the animation's target if provided via defaultTarget (note that setting
    // it via AnimationTarget will happen during the regular property setting phase)
    if (defaultTarget) {
        animation.set_target(defaultTarget);
    }
    
    // If there is an AnimationChildren array and the animation inherits from
    // ParentAnimation, then we will recusively build the child animations.  It is
    // important that we create the child animations before setting the animation's
    // properties or initializing (because some properties and initialization may be
    // propogated down from parent to child).
    if (obj.AnimationChildren && obj.AnimationChildren.length) {
        if ($AA.ParentAnimation.isInstanceOfType(animation)) {
            for (var i = 0; i < obj.AnimationChildren.length; i++) {
                var child = $AA.createAnimation(obj.AnimationChildren[i]);
                if (child) {
                    animation.add(child);
                }
            }
        } else {
            throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_ChildrenNotAllowed, type.getName()));
        }
    }
    
    // Get the list of all properties available to set on the current animation's
    // type.  We create a mapping from the property's lowercase friendly name
    // (i.e., "duration") to the name of its setter (i.e., "set_duration").  This is
    // essentialy in setting properties so we only copy over valid values.
    var properties = type.__animationProperties;
    if (!properties) {
        // Get the properties for this type by walking its prototype - by doing
        // this we'll effectively ignore anything not defined in the prototype
        type.__animationProperties = { };
        type.resolveInheritance();
        for (var name in type.prototype) {
            if (name.startsWith('set_')) {
                type.__animationProperties[name.substr(4).toLowerCase()] = name;
            }
        }
        
        // Remove the 'id' property as it shouldn't be set by the animation
        // (NOTE: the 'target' proeprty shouldn't be set to a string value, but it
        // isn't removed because it can be used as a valid dynamic property - i.e.
        // Target="myElement" *DOES NOT WORK*, but it's OKAY to use
        // TargetScript="$get('myElement')".  Validation for this scenario will be
        // handled automatically by _validateParams when debugging as Target is required
        // to be a dom element.)
        delete type.__animationProperties['id'];
        properties = type.__animationProperties;
    }
    
    // Loop through each of the properties in the object and check if it's in the list
    // of valid property names.  We will check the type of the propertyName to make sure
    // it's a String (as other types can be added by the ASP.NET AJAX compatability
    // layers to all objects and cause errors if you don't exclude them).  We will first
    // try to set a property with the same name if it exists.  If we can't find one but
    // the name of the property ends in 'script', then we will try to set a corresponding
    // dynamic property.  If no matches can be found at all, we'll raise an error when
    // debugging.
    for (var property in obj) {
        // Ignore the special properties in the object that don't correspond
        // to any actual properties on the animation
        var prop = property.toLowerCase();
        if (prop == 'animationname' || prop == 'animationchildren') {
            continue;
        }
        
        var value = obj[property];
        
        // Try to directly set the value of this property
        var setter = properties[prop];
        if (setter && String.isInstanceOfType(setter) && animation[setter]) {
            // Ignore any exceptions raised by setting the property
            // unless we're debugging
            if (! Sys.Debug.isDebug) {
                try { animation[setter](value); } catch (ex) { }
            } else {
                animation[setter](value);
            }
        } else {
            // Try to set the value of a dynamic property
            if (prop.endsWith('script')) {
                setter = properties[prop.substr(0, property.length - 6)];
                if (setter && String.isInstanceOfType(setter) && animation[setter]) {
                    animation.DynamicProperties[setter] = value;
                } else if ( Sys.Debug.isDebug) {
                    // Raise an error when debugging if we could not find a matching property
                    throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_NoDynamicPropertyFound, property, property.substr(0, property.length - 5)));
                }
            } else if ( Sys.Debug.isDebug) {
                // Raise an error when debugging if we could not find a matching property
                throw Error.argument('obj', String.format(AjaxControlToolkit.Resources.Animation_NoPropertyFound, property));
            }
        }
    }
    
    return animation;
}


// In the Xml comments for each of the animations below, there is a special <animation /> tag
// that describes how the animation is referenced from a generic XML animation description


$AA.Animation = function(target, duration, fps) {
    /// <summary>
    /// <code>Animation</code> is an abstract base class used as a starting point for all the other animations.
    /// It provides the basic mechanics for the animation (playing, pausing, stopping, timing, etc.)
    /// and leaves the actual animation to be done in the abstract methods <code>getAnimatedValue</code>
    /// and <code>setValue</code>.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <field name="DynamicProperties" type="Object">
    /// The DynamicProperties collection is used to associate JavaScript expressions with
    /// properties.  The expressions are evaluated just before the animation is played
    /// everytime (in the base onStart method).  The object itself maps strings with the
    /// names of property setters (like "set_verticalOffset") to JavaScript expressions
    /// (like "$find('MyBehavior').get_element().offsetHeight").  Note specifically that
    /// the dynamic properties are JavaScript expressions and not abitrary statements (i.e.
    /// you can't include things like "return foo;"), although you can include anything
    /// inside an anonymous function definition that you immediately invoke (i.e.,
    /// "(function() { return foo; })()").  A dynamic property can be set in the generic
    /// XML animation description by appending Script onto any legitimate property name
    /// (for example, instead of Height="70" we could use
    /// HeightScript="$find('MyBehavior').get_element().offsetHeight").  Any exceptions
    /// raised when setting dynamic properties (including both JavaScript evaluation errors
    /// and other exceptions raised by property setters) will only be propogated when
    /// debugging.
    /// </field>
    /// <remarks>
    /// Animations need to be as fast as possible - even in debug mode.  Don't add validation code to
    /// methods involved in every step of the animation.
    /// </remarks>
    /// <animation>Animation</animation>
    $AA.Animation.initializeBase(this);
    
    // Length of the animation in seconds
    this._duration = 1;
    
    // Number of steps per second
    this._fps = 25;
    
    // Target Sys.UI.DomElement of the animation
    this._target = null;
    
    // Tick event handler
    this._tickHandler = null;
    
    // Animation timer
    this._timer = null;
    
    // Percentage of the animation already played
    this._percentComplete = 0;
    
    // Percentage of the animation to play on each step
    this._percentDelta = null;
    
    // Reference to the animation that owns this animation (currently only set in 
    // ParallelAnimation.add).  This concept of ownership allows an entire animation
    // subtree to be driven off a single timer so all the operations are properly
    // synchronized.
    this._owner = null;
    
    // Reference to the animation that contains this as a child (this is set
    // in ParentAnimation.add).  The primary use of the parent animation is in
    // resolving the animation target when one isn't specified.
    this._parentAnimation = null;
    
    // The DynamicProperties collection is used to associate JavaScript expressions with
    // properties.  The expressions are evaluated just before the animation is played
    // everytime (in the base onStart method).  See the additional information in the
    // XML <field> comment above.
    this.DynamicProperties = { };
    
    // Set the target, duration, and fps if they were provided in the constructor
    if (target) {
        this.set_target(target);
    }
    if (duration) {
        this.set_duration(duration);
    }
    if (fps) { 
        this.set_fps(fps);
    }
}
$AA.Animation.prototype = {
    dispose : function() {
        /// <summary>
        /// Dispose the animation
        /// </summary>
        /// <returns />
        
        if (this._timer) {
            this._timer.dispose();
            this._timer = null;
        }
        
        this._tickHandler = null;
        this._target = null;
        
        $AA.Animation.callBaseMethod(this, 'dispose');
    },
    
    play : function() {
        /// <summary>
        /// Play the animation from the beginning or where it was left off when paused.
        /// </summary>
        /// <returns />
        /// <remarks>
        /// If this animation is the child of another, you must call <code>play</code> on its parent instead.
        /// </remarks>
        
        // If ownership of this animation has been claimed, then we'll require the parent to
        // handle playing the animation (this is very important because then the entire animation
        // tree runs on the same timer and updates consistently)
        if (!this._owner) {
            var resume = true;
            if (!this._timer) {
                resume = false;
                
                if (!this._tickHandler) {
                    this._tickHandler = Function.createDelegate(this, this._onTimerTick);
                }

                this._timer = new Sys.Timer();
                this._timer.add_tick(this._tickHandler);
               
                this.onStart();
                
                this._timer.set_interval(1000 / this._fps);
                this._percentDelta = 100 / (this._duration * this._fps);
                this._updatePercentComplete(0, true);
            }

            this._timer.set_enabled(true);
            
            this.raisePropertyChanged('isPlaying');
            if (!resume) {
                this.raisePropertyChanged('isActive');
            }
        }
    },
    
    pause : function() {
        /// <summary>
        /// Pause the animation if it is playing.  Calling <code>play</code> will resume where
        /// the animation left off.
        /// </summary>
        /// <returns />
        /// <remarks>
        /// If this animation is the child of another, you must call <code>pause</code> on its parent instead.
        /// </remarks>
        
        if (!this._owner) {
            if (this._timer) {
                this._timer.set_enabled(false);
                
                this.raisePropertyChanged('isPlaying');
            }
        }
    },
    
    stop : function(finish) {
        /// <summary>
        /// Stop playing the animation.
        /// </summary>
        /// <param name="finish" type="Boolean" mayBeNull="true" optional="true">
        /// Whether or not stopping the animation should leave the target element in a state
        /// consistent with the animation playing completely by performing the last step.
        /// The default value is true.
        /// </param>
        /// <returns />
        /// <remarks>
        /// If this animation is the child of another, you must call <code>stop</code> on
        /// its parent instead.
        /// </remarks>
        
        if (!this._owner) {
            var t = this._timer;
            this._timer = null;
            if (t) {
                t.dispose();
                
                if (this._percentComplete !== 100) {
                    this._percentComplete = 100;
                    this.raisePropertyChanged('percentComplete');
                    if (finish || finish === undefined) {
                        this.onStep(100);
                    }
                }
                this.onEnd();
                
                this.raisePropertyChanged('isPlaying');
                this.raisePropertyChanged('isActive');
            }
        }
    },
    
    onStart : function() {
        /// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />
        
        this.raiseStarted();
        
        // Initialize any dynamic properties
        for (var property in this.DynamicProperties) {
            try {
                // Invoke the property's setter on the evaluated expression
                this[property](eval(this.DynamicProperties[property]));
            } catch(ex) {
                // Propogate any exceptions if we're debugging, otherwise eat them
                if ( Sys.Debug.isDebug) {
                    throw ex;
                }
            }
        }
    },
    
    onStep : function(percentage) {
        /// <summary>
        /// The <code>onStep</code> method is called repeatedly to progress the animation through each frame
        /// </summary>
        /// <param name="percentage" type="Number">Percentage of the animation already complete</param>
        /// <returns />
        
        this.setValue(this.getAnimatedValue(percentage));
    },
    
    onEnd : function() {
        /// <summary>
        /// The <code>onEnd</code> method is called just after the animation is played each time.
        /// </summary>
        /// <returns />
        
        this.raiseEnded();
    },
    
    getAnimatedValue : function(percentage) {
        /// <summary>
        /// Determine the state of the animation after the given percentage of its duration has elapsed
        /// </summary>
        /// <param name="percentage" type="Number">Percentage of the animation already complete</param>
        /// <returns type="Object">
        /// State of the animation after the given percentage of its duration has elapsed that will
        /// be passed to <code>setValue</code>
        /// </returns>
        throw Error.notImplemented();
    },
    
    setValue : function(value) {
        /// <summary>
        /// Set the current state of the animation
        /// </summary>
        /// <param name="value" type="Object">Current state of the animation (as retreived from <code>getAnimatedValue</code>)</param>
        /// <returns />
        throw Error.notImplemented();
    },
    
    interpolate : function(start, end, percentage) {
        /// <summary>
        /// The <code>interpolate</code> function is used to find the appropriate value between starting and
        /// ending values given the current percentage.
        /// </summary>
        /// <param name="start" type="Number">
        /// Start of the range to interpolate
        /// </param>
        /// <param name="end" type="Number">
        /// End of the range to interpolate
        /// </param>
        /// <param name="percentage" type="Number">
        /// Percentage completed in the range to interpolate
        /// </param>
        /// <returns type="Number">
        /// Value the desired percentage between the start and end values
        /// </returns>
        /// <remarks>
        /// In the future, we hope to make several implementations of this available so we can dynamically
        /// change the apparent speed of the animations, although it may make more sense to modify the
        /// <code>_updatePercentComplete</code> function instead.
        /// </remarks>
        return start + (end - start) * (percentage / 100);
    },
    
    _onTimerTick : function() {
        /// <summary>
        /// Handler for the tick event to move the animation along through its duration
        /// </summary>
        /// <returns />
        this._updatePercentComplete(this._percentComplete + this._percentDelta, true);
    },
    
    _updatePercentComplete : function(percentComplete, animate) {
        /// <summary>
        /// Update the animation and its target given the current percentage of its duration that
        /// has already elapsed
        /// </summary>
        /// <param name="percentComplete" type="Number">
        /// Percentage of the animation duration that has already elapsed
        /// </param>
        /// <param name="animate" type="Boolean" mayBeNull="true" optional="true">
        /// Whether or not updating the animation should visually modify the animation's target
        /// </param>
        /// <returns />
        
        if (percentComplete > 100) {
            percentComplete = 100;
        }
        
        this._percentComplete = percentComplete;
        this.raisePropertyChanged('percentComplete');
        
        if (animate) {
            this.onStep(percentComplete);
        }
        
        if (percentComplete === 100) {
            this.stop(false);
        }
    },
    
    setOwner : function(owner) {
        /// <summary>
        /// Make this animation the child of another animation
        /// </summary>
        /// <param name="owner" type="AjaxControlToolkit.Animation.Animation">
        /// Parent animation
        /// </param>
        /// <returns />
        this._owner = owner;
    },
    
    raiseStarted : function() {
        /// <summary>
        /// Raise the <code>started</code> event
        /// </summary>
        /// <returns />
        var handlers = this.get_events().getHandler('started');
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    
    add_started : function(handler) {
        /// <summary>
        /// Adds an event handler for the <code>started</code> event.
        /// </summary>
        /// <param name="handler" type="Function">
        /// The handler to add to the event.
        /// </param>
        /// <returns />
        this.get_events().addHandler("started", handler);
    },
    
    remove_started : function(handler) {
        /// <summary>
        /// Removes an event handler for the <code>started</code> event.
        /// </summary>
        /// <param name="handler" type="Function">
        /// The handler to remove from the event.
        /// </param>
        /// <returns />
        this.get_events().removeHandler("started", handler);
    },
    
    raiseEnded : function() {
        /// <summary>
        /// Raise the <code>ended</code> event
        /// </summary>
        /// <returns />
        var handlers = this.get_events().getHandler('ended');
        if (handlers) {
            handlers(this, Sys.EventArgs.Empty);
        }
    },
    
    add_ended : function(handler) {
        /// <summary>
        /// Adds an event handler for the <code>ended</code> event.
        /// </summary>
        /// <param name="handler" type="Function">
        /// The handler to add to the event.
        /// </param>
        /// <returns />
        this.get_events().addHandler("ended", handler);
    },
    
    remove_ended : function(handler) {
        /// <summary>
        /// Removes an event handler for the <code>ended</code> event.
        /// </summary>
        /// <param name="handler" type="Function">
        /// The handler to remove from the event.
        /// </param>
        /// <returns />
        this.get_events().removeHandler("ended", handler);
    },
    
    get_target : function() {
        /// <value type="Sys.UI.DomElement" domElement="true" mayBeNull="true">
        /// Target of the animation.  If the target of this animation is null and
        /// the animation has a parent, then it will recursively use the target of
        /// the parent animation instead.
        /// </value>
        /// <remarks>
        /// Do not set this property in a generic Xml animation description. It should be set
        /// using either the extender's TargetControlID or the AnimationTarget property (the latter
        /// maps to AjaxControlToolkit.Animation.set_animationTarget).  The only valid way to
        /// set this property in the generic Xml animation description is to use the dynamic
        /// property TargetScript="$get('myElement')".
        /// <remarks>
        if (!this._target && this._parentAnimation) {
            return this._parentAnimation.get_target();
        }
        return this._target;
    },
    set_target : function(value) {
        if (this._target != value) {
            this._target = value;
            this.raisePropertyChanged('target');
        }
    },
    
    set_animationTarget : function(id) {
        /// <value type="string" mayBeNull="false">
        /// ID of a Sys.UI.DomElement or Sys.UI.Control to use as the target of the animation
        /// </value>
        /// <remarks>
        /// If no Sys.UI.DomElement or Sys.UI.Control can be found for the given ID, an
        /// argument exception will be thrown.
        /// <remarks>
        
        // Try to find a Sys.UI.DomElement
        var target = null;
        var element = $get(id);
        if (element) {
            target = element;
        } else {
            // Try to find the control in the AJAX controls collection
            var ctrl = $find(id);
            if (ctrl) {
                element = ctrl.get_element();
                if (element) {
                    target = element;
                }
            }
        }
        
        // Use the new target if we have one, or raise an error if not
        if (target) { 
            this.set_target(target);
        } else {
            throw Error.argument('id', String.format(AjaxControlToolkit.Resources.Animation_TargetNotFound, id));
        }
    },
    
    get_duration : function() {
        /// <value type="Number">
        /// Length of the animation in seconds.  The default is 1.
        /// </value>
        return this._duration;
    },
    set_duration : function(value) {
        value = this._getFloat(value);
        if (this._duration != value) {
            this._duration = value;
            this.raisePropertyChanged('duration');
        }
    },
    
    get_fps : function() {
        /// <value type="Number" integer="true">
        /// Number of steps per second.  The default is 25.
        /// </value>
        return this._fps;
    },
    set_fps : function(value) {
        value = this._getInteger(value);
        if (this.fps != value) {
            this._fps = value;
            this.raisePropertyChanged('fps');
        }
    },
    
    get_isActive : function() {
        /// <value type="Boolean">
        /// <code>true</code> if animation is active, <code>false</code> if not.
        /// </value>
        return (this._timer !== null);
    },
    
    get_isPlaying : function() {
        /// <value type="Boolean">
        /// <code>true</code> if animation is playing, <code>false</code> if not.
        /// </value>
        return (this._timer !== null) && this._timer.get_enabled();
    },
    
    get_percentComplete : function() {
        /// <value type="Number">
        /// Percentage of the animation already played.
        /// </value>
        return this._percentComplete;
    },
    
    _getBoolean : function(value) {
        /// <summary>
        /// Helper to convert strings to booleans for property setters
        /// </summary>
        /// <param name="value" type="Object">
        /// Value to convert if it's a string
        /// </param>
        /// <returns type="Object">
        /// Value that has been converted if it was a string
        /// </returns>
        if (String.isInstanceOfType(value)) {
            return Boolean.parse(value);
        }
        return value;
    },
    
    _getInteger : function(value) {
        /// <summary>
        /// Helper to convert strings to integers for property setters
        /// </summary>
        /// <param name="value" type="Object">Value to convert if it's a string</param>
        /// <returns type="Object">Value that has been converted if it was a string</returns>
        if (String.isInstanceOfType(value)) {
            return parseInt(value);
        }
        return value;
    },
    
    _getFloat : function(value) {
        /// <summary>
        /// Helper to convert strings to floats for property setters
        /// </summary>
        /// <param name="value" type="Object">Value to convert if it's a string</param>
        /// <returns type="Object">Value that has been converted if it was a string</returns>
        if (String.isInstanceOfType(value)) {
            return parseFloat(value);
        }
        return value;
    },
    
    _getEnum : function(value, type) {
        /// <summary>
        /// Helper to convert strings to enum values for property setters
        /// </summary>
        /// <param name="value" type="Object">Value to convert if it's a string</param>
        /// <param name="type" type="Type">Type of the enum to convert to</param>
        /// <returns type="Object">Value that has been converted if it was a string</returns>
        if (String.isInstanceOfType(value) && type && type.parse) {
            return type.parse(value);
        }
        return value;
    }
}
$AA.Animation.registerClass('AjaxControlToolkit.Animation.Animation', Sys.Component);
$AA.registerAnimation('animation', $AA.Animation);


$AA.ParentAnimation = function(target, duration, fps, animations) {
    /// <summary>
    /// The <code>ParentAnimation</code> serves as a base class for all animations that contain children (such as
    /// <see cref="AjaxControlToolkit.Animation.ParallelAnimation" />, <see cref="AjaxControlToolkit.SequenceAnimation" />,
    /// etc.).  It does not actually play the animations, so any classes that inherit from it must do so.  Any animation
    /// that requires nested child animations must inherit from this class, although it will likely want to inherit off of
    /// <see cref="AjaxControlToolkit.Animation.ParallelAnimation" /> or <see cref="AjaxControlToolkit.SequenceAnimation" />
    /// which will actually play their child animations.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations to be played
    /// </param>
    /// <animation>Parent</animation>
    $AA.ParentAnimation.initializeBase(this, [target, duration, fps]);
    
    // Array of child animations (there are no assumptions placed on order because
    // it will matter for some derived animations like SequenceAnimation, but not
    // for others like ParallelAnimation) that is demand created in add
    this._animations = [];
    
    // Add any child animations passed into the constructor
    if (animations && animations.length) {
        for (var i = 0; i < animations.length; i++) {
            this.add(animations[i]);
        }
    }
}
$AA.ParentAnimation.prototype = {
    initialize : function() {
    	/// <summary>
        /// Initialize the parent along with any child animations that have not yet been initialized themselves
    	/// </summary>
    	/// <returns />
        $AA.ParentAnimation.callBaseMethod(this, 'initialize');
        
        // Initialize all the uninitialized child animations
        if (this._animations) {
            for (var i = 0; i < this._animations.length; i++) {
                var animation = this._animations[i];
                if (animation && !animation.get_isInitialized) {
                    animation.initialize();
                }
            }
        }
    },
    
    dispose : function() {
    	/// <summary>
        /// Dispose of the child animations
    	/// </summary>
    	/// <returns />

        this.clear();
        this._animations = null;
        $AA.ParentAnimation.callBaseMethod(this, 'dispose');
    },
    
    get_animations : function() {
    	/// <value elementType="AjaxControlToolkit.Animation.Animation">
        /// Array of child animations to be played (there are no assumptions placed on order because it will matter for some
        /// derived animations like <see cref="AjaxControlToolkit.Animation.SequenceAnimation" />, but not for
        /// others like <see cref="AjaxControlToolkit.Animation.ParallelAnimation" />).  To manipulate the child
        /// animations, use the functions <code>add</code>, <code>clear</code>, <code>remove</code>, and <code>removeAt</code>.
    	/// </value>
        return this._animations;
    },
    
    add : function(animation) {
    	/// <summary>
        /// Add an animation as a child of this animation.
    	/// </summary>
    	/// <param name="animation" type="AjaxControlToolkit.Animation.Animation">Child animation to add</param>
    	/// <returns />

        if (this._animations) {
            if (animation) {
                animation._parentAnimation = this;
            }
            Array.add(this._animations, animation);
            this.raisePropertyChanged('animations');
        }
    },
    
    remove : function(animation) {
        /// <summary>
        /// Remove the animation from the array of child animations.
        /// </summary>
        /// <param name="animation" type="AjaxControlToolkit.Animation.Animation">
        /// Child animation to remove
        /// </param>
        /// <returns />
        /// <remarks>
        /// This will dispose the removed animation.
        /// </remarks>

        if (this._animations) {
            if (animation) {
                animation.dispose();
            }
            Array.remove(this._animations, animation);
            this.raisePropertyChanged('animations');
        }
    },
    
    removeAt : function(index) {
        /// <summary>
        /// Remove the animation at a given index from the array of child animations.
        /// </summary>
        /// <param name="index" type="Number" integer="true">
        /// Index of the child animation to remove
        /// </param>
        /// <returns />
        
        if (this._animations) {
            var animation = this._animations[index];
            if (animation) {
                animation.dispose();
            }
            Array.removeAt(this._animations, index);
            this.raisePropertyChanged('animations');
        }
    },
    
    clear : function() {
    	/// <summary>
        /// Clear the array of child animations.
    	/// </summary>
    	/// <remarks>
    	/// This will dispose the cleared child animations.
    	/// </remarks>
    	/// <returns />

        if (this._animations) {
            for (var i = this._animations.length - 1; i >= 0; i--) {
                this._animations[i].dispose();
                this._animations[i] = null;
            }
            Array.clear(this._animations);
            this._animations = [];
            this.raisePropertyChanged('animations');
        }
    }
}
$AA.ParentAnimation.registerClass('AjaxControlToolkit.Animation.ParentAnimation', $AA.Animation);
$AA.registerAnimation('parent', $AA.ParentAnimation);


$AA.ParallelAnimation = function(target, duration, fps, animations) {
    /// <summary>
    /// The <code>ParallelAnimation</code> plays several animations simultaneously.  It inherits from
    /// <see cref="AjaxControlToolkit.Animation.ParentAnimation" />, but makes itself the owner of all
    /// its child animations to allow the use a single timer and syncrhonization mechanisms shared with
    /// all the children (in other words, the <code>duration</code> properties of any child animations
    /// are ignored in favor of the parent's <code>duration</code>).  It is very useful in creating
    /// sophisticated effects through combination of simpler animations.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations
    /// </param>
    /// <animation>Parallel</animation>
    $AA.ParallelAnimation.initializeBase(this, [target, duration, fps, animations]);
}
$AA.ParallelAnimation.prototype = {
    add : function(animation) {
    	/// <summary>
        /// Add an animation as a child of this animation and make ourselves its owner.
    	/// </summary>
    	/// <param name="animation" type="AjaxControlToolkit.Animation.Animation">Child animation to add</param>
    	/// <returns />
        $AA.ParallelAnimation.callBaseMethod(this, 'add', [animation]);
        animation.setOwner(this);
    },
    
    onStart : function() {
        /// <summary>
        /// Get the child animations ready to play
        /// </summary>
        /// <returns />

        $AA.ParallelAnimation.callBaseMethod(this, 'onStart');
        var animations = this.get_animations();
        for (var i = 0; i < animations.length; i++) {
            animations[i].onStart();
        }
    },
    
    onStep : function(percentage) {
        /// <summary>
        /// Progress the child animations through each frame
        /// </summary>
        /// <param name="percentage" type="Number">
        /// Percentage of the animation already complete
        /// </param>
        /// <returns />

        var animations = this.get_animations();
        for (var i = 0; i < animations.length; i++) {
            animations[i].onStep(percentage);
        }
    },
    
    onEnd : function() {
        /// <summary>
        /// Finish playing all of the child animations
        /// </summary>
        /// <returns />

        var animations = this.get_animations();
        for (var i = 0; i < animations.length; i++) {
            animations[i].onEnd();
        }
        $AA.ParallelAnimation.callBaseMethod(this, 'onEnd');
    }
}
$AA.ParallelAnimation.registerClass('AjaxControlToolkit.Animation.ParallelAnimation', $AA.ParentAnimation);
$AA.registerAnimation('parallel', $AA.ParallelAnimation);


$AA.SequenceAnimation = function(target, duration, fps, animations, iterations) {
    /// <summary>
    /// The <code>SequenceAnimation</code> runs several animations one after the other.  It can also
    /// repeat the sequence of animations for a specified number of iterations (which defaults to a
    /// single iteration, but will repeat forever if you specify zero or less iterations).  Also, the
    /// <code>SequenceAnimation</code> cannot be a child of a <see cref="AjaxControlToolkit.Animation.ParallelAnimation" />
    /// (or any animation inheriting from it).
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations
    /// </param>
    /// <param name="iterations" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of times to repeatedly play the sequence.  If zero or less iterations are specified, the sequence
    /// will repeat forever.  The default value is 1 iteration.
    /// </param>
    /// <remarks>
    /// The <code>SequenceAnimation</code> ignores the <code>duration</code> and <code>fps</code>
    /// properties, and will let each of its child animations use any settings they please.
    /// </remarks>
    /// <animation>Sequence</animation>
    $AA.SequenceAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Handler used to determine when an animation has finished
    this._handler = null;
    
    // Flags to note whether we're playing, paused, or stopped
    this._paused = false;
    this._playing = false;
    
    // Index of the currently executing animation in the sequence
    this._index = 0;
    
    // Counter used when playing the animation to determine the remaining number of times to play the entire sequence
    this._remainingIterations = 0;
    
    // Number of iterations
    this._iterations = (iterations !== undefined) ? iterations : 1;
}
$AA.SequenceAnimation.prototype = {
    dispose : function() {
    	/// <summary>
        /// Dispose the animation
        /// </summary>
        /// <returns />
        this._handler = null;
        $AA.SequenceAnimation.callBaseMethod(this, 'dispose');
    },
    
    stop : function() {
        /// <summary>
        /// Stop playing the entire sequence of animations
        /// </summary>
        /// <returns />
        /// <remarks>
        /// Stopping this animation will perform the last step of each child animation, thereby leaving their
        /// target elements in a state consistent with the animation playing completely. If this animation is
        /// the child of another, you must call <code>stop</code> on its parent instead.
        /// </remarks>

        if (this._playing) {
            var animations = this.get_animations();
            if (this._index < animations.length) {
                // Remove the handler from the currently running animation
                animations[this._index].remove_ended(this._handler);
                // Call stop on all remaining animations to ensure their
                // effects will be seen
                for (var i = this._index; i < animations.length; i++) {
                    animations[i].stop();
                }
            }
            this._playing = false;
            this._paused = false;
            this.raisePropertyChanged('isPlaying');
            this.onEnd();
        }
    },
    
    pause : function() {
        /// <summary>
        /// Pause the animation if it is playing.  Calling <code>play</code> will resume where
        /// the animation left off.
        /// </summary>
        /// <returns />
        /// <remarks>
        /// If this animation is the child of another, you must call <code>pause</code> on its parent instead.
        /// </remarks>

        if (this.get_isPlaying()) {
            var current = this.get_animations()[this._index];
            if (current != null) {
                current.pause();
            }
            this._paused = true;
            this.raisePropertyChanged('isPlaying');
        }
    },
    
    play : function() {
        /// <summary>
        /// Play the sequence of animations from the beginning or where it was left off when paused
        /// </summary>
        /// <returns />
        /// <remarks>
        /// If this animation is the child of another, you must call <code>play</code> on its parent instead
        /// </remarks>

        var animations = this.get_animations();
        if (!this._playing) {
            this._playing = true;
            if (this._paused) {
                this._paused = false;
                var current = animations[this._index];
                if (current != null) {
                    current.play();
                    this.raisePropertyChanged('isPlaying');
                }
            } else {
                this.onStart();
                // Reset the index and attach the handler to the first
                this._index = 0;
                var first = animations[this._index];
                if (first) {
                    first.add_ended(this._handler);
                    first.play();
                    this.raisePropertyChanged('isPlaying');
                } else {
                    this.stop();
                }
            }
        }
    },
    
    onStart : function() {
        /// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time
        /// </summary>
        /// <returns />
        $AA.SequenceAnimation.callBaseMethod(this, 'onStart');
        this._remainingIterations = this._iterations - 1;
        
        // Create the handler we attach to each animation as it plays to determine when we've finished with it
        if (!this._handler) {
            this._handler = Function.createDelegate(this, this._onEndAnimation);
        }
    },
    
    _onEndAnimation : function() {
    	/// <summary>
        /// Wait for the end of each animation, and then continue by playing the other animations remaining
        /// in the sequence.  Stop when it reaches the last animation and there are no remaining iterations.
    	/// </summary>
    	/// <returns />

        // Remove the handler from the current animation
        var animations = this.get_animations();
        var current = animations[this._index++];
        if (current) {
            current.remove_ended(this._handler);
        }
        
        // Keep running animations and stop when we're out
        if (this._index < animations.length) {
            var next = animations[this._index];
            next.add_ended(this._handler);
            next.play();
        } else if (this._remainingIterations >= 1 || this._iterations <= 0) {
            this._remainingIterations--;
            this._index = 0;
            var first = animations[0];
            first.add_ended(this._handler);
            first.play();
        } else {
            this.stop();
        }
    },
    
    onStep : function(percentage) {
        /// <summary>
        /// Raises an invalid operation exception because this will only be called if a <code>SequenceAnimation</code>
        /// has been nested inside an <see cref="AjaxControlToolkit.Animation.ParallelAnimation" /> (or a derived type).
        /// </summary>
        /// <param name="percentage" type="Number">Percentage of the animation already complete</param>
        /// <returns />
        throw Error.invalidOperation(AjaxControlToolkit.Resources.Animation_CannotNestSequence);
    },
    
    onEnd : function() {
        /// <summary>
        /// The <code>onEnd</code> method is called just after the animation is played each time.
        /// </summary>
        /// <returns />
        this._remainingIterations = 0;
        $AA.SequenceAnimation.callBaseMethod(this, 'onEnd');
    },
    
    get_isActive : function() {
    	/// <value type="Boolean">
        /// <code>true</code> if animation is active, <code>false</code> if not.
        /// </value>
        return true;
    },
    
    get_isPlaying : function() {
    	/// <value type="Boolean">
        /// <code>true</code> if animation is playing, <code>false</code> if not.
        /// </value>
        return this._playing && !this._paused;
    },
    
    get_iterations : function() {
        /// <value type="Number" integer="true">
        /// Number of times to repeatedly play the sequence.  If zero or less iterations are specified, the sequence
        /// will repeat forever.  The default value is 1 iteration.
        /// </value>
        return this._iterations;
    },
    set_iterations : function(value) {
        value = this._getInteger(value);
        if (this._iterations != value) {
            this._iterations = value;
            this.raisePropertyChanged('iterations');
        }
    },
    
    get_isInfinite : function() {
    	/// <value type="Boolean">
        /// <code>true</code> if this animation will repeat forever, <code>false</code> otherwise.
    	/// </value>
        return this._iterations <= 0;
    }
}
$AA.SequenceAnimation.registerClass('AjaxControlToolkit.Animation.SequenceAnimation', $AA.ParentAnimation);
$AA.registerAnimation('sequence', $AA.SequenceAnimation);


$AA.SelectionAnimation = function(target, duration, fps, animations) {
    /// <summary>
    /// The <code>SelectionAnimation</code> will run a single animation chosen from of its child animations. It is
    /// important to note that the <code>SelectionAnimation</code> ignores the <code>duration</code> and <code>fps</code>
    /// properties, and will let each of its child animations use any settings they please.  This is a base class with no
    /// functional implementation, so consider using <see cref="AjaxControlToolkit.Animation.ConditionAnimation" /> or
    /// <see cref="AjaxControlToolkit.Animation.CaseAnimation" /> instead.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations
    /// </param>
    /// <animation>Selection</animation>
    $AA.SelectionAnimation.initializeBase(this, [target, duration, fps, animations]);
    
    // Index of the animation selected to play
    this._selectedIndex = -1;
    
    // Reference to the animation selected to play
    this._selected = null;
}
$AA.SelectionAnimation.prototype = {    
    getSelectedIndex : function() {
        /// <summary>
        /// Get the index of the animation that is selected to be played.  If this returns an index outside the bounds of
        /// the child animations array, then nothing is played.
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Index of the selected child animation to play
        /// </returns>
        throw Error.notImplemented();
    },
    
    onStart : function() {
    	/// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />
	    $AA.SelectionAnimation.callBaseMethod(this, 'onStart');
	    
	    var animations = this.get_animations();
	    this._selectedIndex = this.getSelectedIndex();
	    if (this._selectedIndex >= 0 && this._selectedIndex < animations.length) {
	        this._selected = animations[this._selectedIndex];
	        if (this._selected) {
	            this._selected.setOwner(this);
	            this._selected.onStart();
	        }
	    }
    },
    
    onStep : function(percentage) {
    	/// <summary>
        /// The <code>onStep</code> method is called repeatedly to progress the animation through each frame
        /// </summary>
        /// <param name="percentage" type="Number">Percentage of the animation already complete</param>
        /// <returns />

        if (this._selected) {
    	    this._selected.onStep(percentage);
    	}
    },
    
    onEnd : function() {
    	/// <summary>
        /// The <code>onEnd</code> method is called just after the animation is played each time.
        /// </summary>
        /// <returns />

        if (this._selected) {
    	    this._selected.onEnd();
    	    this._selected.setOwner(null);
    	}
    	this._selected = null;
    	this._selectedIndex = null;
	    $AA.SelectionAnimation.callBaseMethod(this, 'onEnd');
    }
}
$AA.SelectionAnimation.registerClass('AjaxControlToolkit.Animation.SelectionAnimation', $AA.ParentAnimation);
$AA.registerAnimation('selection', $AA.SelectionAnimation);


$AA.ConditionAnimation = function(target, duration, fps, animations, conditionScript) {
    /// <summary>
    /// The <code>ConditionAnimation</code> is used as a control structure to play a specific child animation
    /// depending on the result of executing the <code>conditionScript</code>.  If the <code>conditionScript</code>
    /// evaluates to <code>true</code>, the first child animation is played.  If it evaluates to <code>false</code>,
    /// the second child animation is played (although nothing is played if a second animation is not present).
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations
    /// </param>
    /// <param name="conditionScript" type="String" mayBeNull="true" optional="true">
    /// JavaScript that should evaluate to <code>true</code> or <code>false</code> to determine which child
    /// animation to play.
    /// </param>
    /// <animation>Condition</animation>
    $AA.ConditionAnimation.initializeBase(this, [target, duration, fps, animations]);
    
    // Condition to determine which index we will play
    this._conditionScript = conditionScript;   
}
$AA.ConditionAnimation.prototype = {    
   getSelectedIndex : function() {
       /// <summary>
       /// Get the index of the animation that is selected to be played.  If this returns an index outside the bounds of
       /// the child animations array, then nothing is played.
       /// </summary>
       /// <returns type="Number" integer="true">
       /// Index of the selected child animation to play
       /// </returns>

        var selected = -1;
        if (this._conditionScript && this._conditionScript.length > 0) {
            try {
                selected = eval(this._conditionScript) ? 0 : 1;
            } catch(ex) {
            }
        }
        return selected;
    },
    
    get_conditionScript : function() {
    	/// <value type="String">
        /// JavaScript that should evaluate to <code>true</code> or <code>false</code> to determine which
        /// child animation to play.
    	/// </value>
        return this._conditionScript;
    },
    set_conditionScript : function(value) {
        if (this._conditionScript != value) {
            this._conditionScript = value;
            this.raisePropertyChanged('conditionScript');
        }
    }
}
$AA.ConditionAnimation.registerClass('AjaxControlToolkit.Animation.ConditionAnimation', $AA.SelectionAnimation);
$AA.registerAnimation('condition', $AA.ConditionAnimation);


$AA.CaseAnimation = function(target, duration, fps, animations, selectScript) {
    /// <summary>
    /// The <code>CaseAnimation</code> is used as a control structure to play a specific child animation depending on
    /// the result of executing the <code>selectScript</code>, which should return the index of the child animation to
    /// play (this is similar to the <code>case</code> or <code>select</code> statements in C#/VB, etc.).  If the provided
    /// index is outside the bounds of the child animations array (or if nothing was returned) then we will not play anything.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="animations" mayBeNull="true" optional="true" parameterArray="true" elementType="AjaxControlToolkit.Animation.Animation">
    /// Array of child animations
    /// </param>
    /// <param name="selectScript" type="String" mayBeNull="true" optional="true">
    /// JavaScript that should evaluate to the index of the appropriate child animation to play.  If this returns an index outside the bounds of the child animations array, then nothing is played.
    /// </param>
    /// <animation>Case</animation>
    $AA.CaseAnimation.initializeBase(this, [target, duration, fps, animations]);

    // Condition to determine which index we will play
    this._selectScript = selectScript;
}
$AA.CaseAnimation.prototype = {
    getSelectedIndex : function() {
        /// <summary>
        /// Get the index of the animation that is selected to be played.  If this returns an index outside the bounds of
        /// the child animations array, then nothing is played.
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Index of the selected child animation to play
        /// </returns>

        var selected = -1;
        if (this._selectScript && this._selectScript.length > 0) {
            try {
                var result = eval(this._selectScript)
                if (result !== undefined)
                    selected = result;
            } catch (ex) {
            }
        }
        return selected;
    },
    
    get_selectScript : function() {
        /// <value type="String">
        /// JavaScript that should evaluate to the index of the appropriate child animation to play.  If this returns an index outside the bounds of the child animations array, then nothing is played.
        /// </value>
        return this._selectScript;
    },
    set_selectScript : function(value) {
        if (this._selectScript != value) {
            this._selectScript = value;
            this.raisePropertyChanged('selectScript');
        }
    }
}
$AA.CaseAnimation.registerClass('AjaxControlToolkit.Animation.CaseAnimation', $AA.SelectionAnimation);
$AA.registerAnimation('case', $AA.CaseAnimation);


$AA.FadeEffect = function() {
    /// <summary>
    /// The FadeEffect enumeration determines whether a fade animation is used to fade in or fade out.
    /// </summary>
    /// <field name="FadeIn" type="Number" integer="true" />
    /// <field name="FadeOut" type="Number" integer="true" />
    throw Error.invalidOperation();
}
$AA.FadeEffect.prototype = {
    FadeIn : 0,
    FadeOut : 1
}
$AA.FadeEffect.registerEnum("AjaxControlToolkit.Animation.FadeEffect", false);


$AA.FadeAnimation = function(target, duration, fps, effect, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    /// <summary>
    /// The <code>FadeAnimation</code> is used to fade an element in or out of view, depending on the
    /// provided <see cref="AjaxControlToolkit.Animation.FadeEffect" />, by settings its opacity.
    /// The minimum and maximum opacity values can be specified to precisely control the fade.
    /// You may also consider using <see cref="AjaxControlToolkit.Animation.FadeInAnimation" /> or
    /// <see cref="AjaxControlToolkit.Animation.FadeOutAnimation" /> if you know the only direction you
    /// are fading.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="effect" type="AjaxControlToolkit.Animation.FadeEffect" mayBeNull="true" optional="true">
    /// Determine whether to fade the element in or fade the element out.  The possible values are <code>FadeIn</code>
    /// and <code>FadeOut</code>.  The default value is <code>FadeOut</code>.
    /// </param>
    /// <param name="minimumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
    /// </param>
    /// <param name="maximumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
    /// </param>
    /// <param name="forceLayoutInIE" type="Boolean" mayBeNull="true" optional="true">
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
    /// This is obviously ignored when working in other browsers.
    /// </param>
    /// <animation>Fade</animation>
    $AA.FadeAnimation.initializeBase(this, [target, duration, fps]);

    // The effect determines whether or not we fade in or out
    this._effect = (effect !== undefined) ? effect : $AA.FadeEffect.FadeIn;
    
    // Maximum and minimum opacities default to 100% and 0%
    this._max = (maximumOpacity !== undefined) ? maximumOpacity : 1;
    this._min = (minimumOpacity !== undefined) ? minimumOpacity : 0;
    
    // Starting and ending opacities
    this._start = this._min;
    this._end = this._max;
    
    // Whether the a layout has already been created (to work around IE problems)
    this._layoutCreated = false;

    // Whether or not we should force a layout to be created for IE by giving it a width
    // and setting its background color (the latter is required in case the user has ClearType enabled).
    // http://msdn.microsoft.com/library/default.asp?url=/workshop/author/filter/reference/filters/alpha.asp
    this._forceLayoutInIE = (forceLayoutInIE === undefined || forceLayoutInIE === null) ? true : forceLayoutInIE;
    
    // Current target of the animation that is cached before the animation plays (since looking up
    // the target could mean walking all the way up to the root of the animation's tree, which we don't
    // want to do for every step of the animation)
    this._currentTarget = null;
    
    // Properly set up the min/max values provided by the constructor
    this._resetOpacities();
}
$AA.FadeAnimation.prototype = {
    _resetOpacities : function() {
    	/// <summary>
        /// Set the starting and ending opacity values based on the effect (i.e. when we're fading
        /// in we go from <code>_min</code> to <code>_max</code>, but we go <code>_max</code> to
        /// <code>_min</code> when fading out)
    	/// </summary>
    	/// <returns />

        if (this._effect == $AA.FadeEffect.FadeIn) {
            this._start = this._min;
            this._end = this._max;
        } else {
            this._start = this._max;
            this._end = this._min;
        }
    },
    
    _createLayout : function() {
    	/// <summary>
        /// Create a layout when using Internet Explorer (which entails setting a width and also
        /// a background color if it currently has neither)
    	/// </summary>
    	/// <returns />

        var element = this._currentTarget;
        if (element) {
            // Get the original width/height/back color
            var originalWidth = $common.getCurrentStyle(element, 'width');
            var originalHeight = $common.getCurrentStyle(element, 'height');
            var originalBackColor = $common.getCurrentStyle(element, 'backgroundColor');

            // Set the width which will force the creation of a layout
            if ((!originalWidth || originalWidth == '' || originalWidth == 'auto') &&
                (!originalHeight || originalHeight == '' || originalHeight == 'auto')) {
                element.style.width = element.offsetWidth + 'px';
            }
            
            // Set the back color to avoid ClearType problems
            if (!originalBackColor || originalBackColor == '' || originalBackColor == 'transparent' || originalBackColor == 'rgba(0, 0, 0, 0)') {
                element.style.backgroundColor = $common.getInheritedBackgroundColor(element);
            }
            
            // Mark that we've created the layout so we only do it once
            this._layoutCreated = true;
        }
    },
    
    onStart : function() {
    	/// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />       
        $AA.FadeAnimation.callBaseMethod(this, 'onStart');
        
        this._currentTarget = this.get_target();
        this.setValue(this._start);
        
        // Force the creation of a layout in IE if we're supposed to and the current browser is Internet Explorer
        if (this._forceLayoutInIE && !this._layoutCreated && Sys.Browser.agent == Sys.Browser.InternetExplorer) {
            this._createLayout();
        }
    },
    
    getAnimatedValue : function(percentage) {
    	/// <summary>
        /// Determine the current opacity after the given percentage of its duration has elapsed
        /// </summary>
        /// <param name="percentage" type="Number">Percentage of the animation already complete</param>
        /// <returns type="Number">
        /// Current opacity after the given percentage of its duration has elapsed that will
        /// be passed to <code>setValue</code>
        /// </returns>
        return this.interpolate(this._start, this._end, percentage);
    },
    
    setValue : function(value) {
        /// <summary>
        /// Set the current opacity of the element.
        /// </summary>
        /// <param name="value" type="Number">
        /// Current opacity (as retreived from <code>getAnimatedValue</code>)
        /// </param>
        /// <returns />
        /// <remarks>
        /// This method will be replaced by a dynamically generated function that requires no logic
        /// to determine whether it should use filters or the style's opacity.
        /// </remarks>
        if (this._currentTarget) {
            $common.setElementOpacity(this._currentTarget, value);
        }
    },
    
//    set_target : function(value) {
//        /// <value type="Sys.UI.DomElement">
//        /// Override the <code>target</code> property to dynamically create the setValue function.
//        /// </value>
//        /// <remarks>
//        /// Do not set this property in a generic Xml animation description. It will be set automatically
//        /// using either the extender's TargetControlID or the AnimationTarget property.
//        /// <remarks>
//        $AA.FadeAnimation.callBaseMethod(this, 'set_target', [value]);
//        
//        var element = value;
//        if (element) {
//            var filters = element.filters;
//            if (filters) {
//                var alphaFilter = null;
//                if (filters.length !== 0) {
//                    alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
//                }
//                if (!alphaFilter) {
//                    element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (this._start * 100) + ')';
//                    alphaFilter = filters['DXImageTransform.Microsoft.Alpha'];
//                }
//                if (alphaFilter) {
//                    this.setValue = function(val) { alphaFilter.opacity = val * 100; }
//                } else {
//                    this.setValue = function(val) {
//                        element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + (val * 100) + ')';
//                    };
//                }
//            }
//            else {
//                this.setValue = function(val) { element.style.opacity = val; };
//            }
//        }
//    },
    
    get_effect : function() {
    	/// <value type="AjaxControlToolkit.Animation.FadeEffect">
        /// Determine whether to fade the element in or fade the element out.  The possible values are
        /// <code>FadeIn</code> and <code>FadeOut</code>.  The default value is <code>FadeOut</code>.
    	/// </value>
        return this._effect;
    },
    set_effect : function(value) {
        value = this._getEnum(value, $AA.FadeEffect);
        if (this._effect != value) {
            this._effect = value;
            this._resetOpacities();
            this.raisePropertyChanged('effect');
        }
    },
    
    get_minimumOpacity : function() {
        /// <value type="Number">
        /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1.
        /// The default value is 0.
        /// </value>
	    return this._min;
    },
    set_minimumOpacity : function(value) {
        value = this._getFloat(value);
        if (this._min != value) {
            this._min = value;
            this._resetOpacities();
            this.raisePropertyChanged('minimumOpacity');
        }
    },
    
    get_maximumOpacity : function() {
        /// <value type="Number">
        /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1.
        /// The default value is 1.
        /// </value>
        return this._max;
    },
    set_maximumOpacity : function(value) {
        value = this._getFloat(value);
        if (this._max != value) {
            this._max = value;
            this._resetOpacities();
            this.raisePropertyChanged('maximumOpacity');
        }
    },
    
    get_forceLayoutInIE : function() {
        /// <value type="Boolean">
        /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
        /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
        /// This is obviously ignored when working in other browsers.
        /// </value>
        return this._forceLayoutInIE;
    },
    set_forceLayoutInIE : function(value) {
        value = this._getBoolean(value);
        if (this._forceLayoutInIE != value) {
            this._forceLayoutInIE = value;
            this.raisePropertyChanged('forceLayoutInIE');
        }
    },
    
    set_startValue : function(value) {
        /// <value type="Number">
        /// Set the start value (so that child animations can set the current opacity as the start value when fading in or out)
        /// </value>
        value = this._getFloat(value);
        this._start = value;
    }
}
$AA.FadeAnimation.registerClass('AjaxControlToolkit.Animation.FadeAnimation', $AA.Animation);
$AA.registerAnimation('fade', $AA.FadeAnimation);


$AA.FadeInAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    /// <summary>
    /// The <code>FadeInAnimation</code> will fade the target in by moving from hidden to visible.
    /// It starts the animation the target's current opacity.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="minimumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
    /// </param>
    /// <param name="maximumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
    /// </param>
    /// <param name="forceLayoutInIE" type="Boolean" mayBeNull="true" optional="true">
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
    /// This is obviously ignored when working in other browsers.
    /// </param>
    /// <animation>FadeIn</animation>
    $AA.FadeInAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeIn, minimumOpacity, maximumOpacity, forceLayoutInIE]);
}
$AA.FadeInAnimation.prototype = {
    onStart : function() {
    	/// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />
        $AA.FadeInAnimation.callBaseMethod(this, 'onStart');
        
        if (this._currentTarget) {
            this.set_startValue($common.getElementOpacity(this._currentTarget));
        }
    }
}
$AA.FadeInAnimation.registerClass('AjaxControlToolkit.Animation.FadeInAnimation', $AA.FadeAnimation);
$AA.registerAnimation('fadeIn', $AA.FadeInAnimation);


$AA.FadeOutAnimation = function(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    /// <summary>
    /// The FadeInAnimation will fade the element out by moving from visible to hidden. It starts the animation
    /// at the element's current opacity.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="minimumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
    /// </param>
    /// <param name="maximumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
    /// </param>
    /// <param name="forceLayoutInIE" type="Boolean" mayBeNull="true" optional="true">
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
    /// This is obviously ignored when working in other browsers.
    /// </param>
    /// <animation>FadeOut</animation>
    $AA.FadeOutAnimation.initializeBase(this, [target, duration, fps, $AA.FadeEffect.FadeOut, minimumOpacity, maximumOpacity, forceLayoutInIE]);
}
$AA.FadeOutAnimation.prototype = {
    onStart : function() {
    	/// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />
        $AA.FadeOutAnimation.callBaseMethod(this, 'onStart');

        if (this._currentTarget) {
            this.set_startValue($common.getElementOpacity(this._currentTarget));
        }
    }
}
$AA.FadeOutAnimation.registerClass('AjaxControlToolkit.Animation.FadeOutAnimation', $AA.FadeAnimation);
$AA.registerAnimation('fadeOut', $AA.FadeOutAnimation);


$AA.PulseAnimation = function(target, duration, fps, iterations, minimumOpacity, maximumOpacity, forceLayoutInIE) {
    /// <summary>
    /// The PulseAnimation fades an element in and our repeatedly to create a pulsating
    /// effect.  The iterations determines how many pulses there will be (which defaults
    /// to three, but it will repeat infinitely if given zero or less).  The duration
    /// property defines the duration of each fade in or fade out, not the duration of
    /// the animation as a whole.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="iterations" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of times to repeatedly play the sequence.  If zero or less iterations are specified, the sequence
    /// will repeat forever.  The default value is 1 iteration.
    /// </param>
    /// <param name="minimumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
    /// </param>
    /// <param name="maximumOpacity" type="Number" mayBeNull="true" optional="true">
    /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
    /// </param>
    /// <param name="forceLayoutInIE" type="Boolean" mayBeNull="true" optional="true">
    /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
    /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
    /// This is obviously ignored when working in other browsers.
    /// </param>
    /// <animation>Pulse</animation>
    $AA.PulseAnimation.initializeBase(this, [target, duration, fps, null, ((iterations !== undefined) ? iterations : 3)]);

    // Create the FadeOutAnimation
    this._out = new $AA.FadeOutAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);
    this.add(this._out);
    
    // Create the FadeInAnimation
    this._in = new $AA.FadeInAnimation(target, duration, fps, minimumOpacity, maximumOpacity, forceLayoutInIE);
    this.add(this._in);
}
$AA.PulseAnimation.prototype = {
   
    get_minimumOpacity : function() {
        /// <value type="Number">
        /// Minimum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 0.
        /// </value>
        return this._out.get_minimumOpacity();
    },
    set_minimumOpacity : function(value) {
        value = this._getFloat(value);
        this._out.set_minimumOpacity(value);
        this._in.set_minimumOpacity(value);
        this.raisePropertyChanged('minimumOpacity');
    },
    
    get_maximumOpacity : function() {
        /// <value type="Number">
        /// Maximum opacity to use when fading in or out. Its value can range from between 0 to 1. The default value is 1.
        /// </value>
        return this._out.get_maximumOpacity();
    },
    set_maximumOpacity : function(value) {
        value = this._getFloat(value);
        this._out.set_maximumOpacity(value);
        this._in.set_maximumOpacity(value);
        this.raisePropertyChanged('maximumOpacity');
    },
    
    get_forceLayoutInIE : function() {
        /// <value type="Boolean">
        /// Whether or not we should force a layout to be created for Internet Explorer by giving it a width and setting its
        /// background color (the latter is required in case the user has ClearType enabled). The default value is <code>true</code>.
        /// This is obviously ignored when working in other browsers.
        /// </value>
        return this._out.get_forceLayoutInIE();
    },
    set_forceLayoutInIE : function(value) {
        value = this._getBoolean(value);
        this._out.set_forceLayoutInIE(value);
        this._in.set_forceLayoutInIE(value);
        this.raisePropertyChanged('forceLayoutInIE');
    },
    
    set_duration : function(value) {
        /// <value type="Number">
        /// Override the <code>duration</code> property
        /// </value>
        value = this._getFloat(value);
        $AA.PulseAnimation.callBaseMethod(this, 'set_duration', [value]);
        this._in.set_duration(value);
        this._out.set_duration(value);
    },
    
    set_fps : function(value) {
        /// <value type="Number" integer="true">
        /// Override the <code>fps</code> property
        /// </value>
        value = this._getInteger(value);
        $AA.PulseAnimation.callBaseMethod(this, 'set_fps', [value]);
        this._in.set_fps(value);
        this._out.set_fps(value);
    }
    
}
$AA.PulseAnimation.registerClass('AjaxControlToolkit.Animation.PulseAnimation', $AA.SequenceAnimation);
$AA.registerAnimation('pulse', $AA.PulseAnimation);


$AA.PropertyAnimation = function(target, duration, fps, property, propertyKey) {
    /// <summary>
    /// The <code>PropertyAnimation</code> is a useful base animation that will assign the value from
    /// <code>getAnimatedValue</code> to a specified <code>property</code>. You can provide the name of
    /// a <code>property</code> alongside an optional <code>propertyKey</code> (which indicates the value
    /// <code>property[propertyKey]</code>, like <code>style['backgroundColor']</code>).
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="property" type="String" mayBeNull="true" optional="true">
    /// Property of the <code>target</code> element to set when animating
    /// </param>
    /// <param name="propertyKey" type="String" mayBeNull="true" optional="true">
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </param>
    /// <animation>Property</animation>
    $AA.PropertyAnimation.initializeBase(this, [target, duration, fps]);

    // Name of the property to set
    this._property = property;
    
    // Optional Key of the property to set (i.e., if the property were "style" then
    // this might be "backgroundColor")
    this._propertyKey = propertyKey;
    
    // Current target of the animation that is cached before the animation plays (since looking up
    // the target could mean walking all the way up to the root of the animation's tree, which we don't
    // want to do for every step of the animation)
    this._currentTarget = null;
}
$AA.PropertyAnimation.prototype = {
    onStart : function() {
    	/// <summary>
        /// The <code>onStart</code> method is called just before the animation is played each time.
        /// </summary>
        /// <returns />
        $AA.PropertyAnimation.callBaseMethod(this, 'onStart');

        this._currentTarget = this.get_target();
    },

    setValue : function(value) {
        /// <summary>
        /// Set the current value of the property
        /// </summary>
        /// <param name="value" type="Object" mayBeNull="true">
        /// Value to assign
        /// </param>
        /// <returns />

        var element = this._currentTarget;
        if (element && this._property && this._property.length > 0) { 
            if (this._propertyKey && this._propertyKey.length > 0 && element[this._property]) {
                element[this._property][this._propertyKey] = value;
            } else {
                element[this._property] = value;
            }
        }
        // Sys.TypeDescriptor.setProperty(this.get_target(), this._property, value, this._propertyKey);
    },
    
    getValue : function() {
        /// <summary>
        /// Get the current value from the property
        /// </summary>
        /// <returns type="Object" mayBeNull="true">
        /// Current value of the property
        /// </returns>

        var element = this.get_target();
        if (element && this._property && this._property.length > 0) { 
            var property = element[this._property];
            if (property) {
                if (this._propertyKey && this._propertyKey.length > 0) {
                    return property[this._propertyKey];
                }
                return property;
            }
        }
        return null;
        // return Sys.TypeDescriptor.getProperty(this.get_target(), this._property, this._propertyKey);
    },
    
    get_property : function() {
        /// <value type="String">
        /// Property of the <code>target</code> element to set when animating
        /// </value>
        return this._property;
    },
    set_property : function(value) {
        if (this._property != value) {
            this._property = value;
            this.raisePropertyChanged('property');
        }
    },
    
    get_propertyKey : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
        /// </value>
        return this._propertyKey;
    },
    set_propertyKey : function(value) {
        if (this._propertyKey != value) {
            this._propertyKey = value;
            this.raisePropertyChanged('propertyKey');
        }
    }
}
$AA.PropertyAnimation.registerClass('AjaxControlToolkit.Animation.PropertyAnimation', $AA.Animation);
$AA.registerAnimation('property', $AA.PropertyAnimation);


$AA.DiscreteAnimation = function(target, duration, fps, property, propertyKey, values) {
    /// <summary>
    /// The <code>DiscreteAnimation</code> inherits from <see cref="AjaxControlToolkit.Animation.PropertyAnimation" />
    /// and sets the value of the <code>property</code> to the elements in a provided array of <code>values</code>.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="property" type="String" mayBeNull="true" optional="true">
    /// Property of the <code>target</code> element to set when animating
    /// </param>
    /// <param name="propertyKey" type="String" mayBeNull="true" optional="true">
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </param>
    /// <param name="values" mayBeNull="true" optional="true" parameterArray="true" elementType="Object">
    /// Array of possible values of the property that will be iterated over as the animation is played
    /// </param>
    /// <animation>Discrete</animation>
    $AA.DiscreteAnimation.initializeBase(this, [target, duration, fps, property, propertyKey]);

    // Values to assign to the property
    this._values = (values && values.length) ? values : [];
}
$AA.DiscreteAnimation.prototype = {
    getAnimatedValue : function(percentage) {
        /// <summary>
        /// Assign the value whose index corresponds to the current percentage
        /// </summary>
        /// <param name="percentage" type="Number">
        /// Percentage of the animation already complete
        /// </param>
        /// <returns type="Object">
        /// State of the animation after the given percentage of its duration has elapsed that will
        /// be passed to <code>setValue</code>
        /// </returns>
        var index = Math.floor(this.interpolate(0, this._values.length - 1, percentage));
        return this._values[index];
    },
    
    get_values : function() {
        /// <value parameterArray="true" elementType="Object">
        /// Array of possible values of the property that will be iterated over as the animation is played
        /// </value>
        return this._values;
    },
    set_values : function(value) {
        if (this._values != value) {
            this._values = value;
            this.raisePropertyChanged('values');
        }
    }
}
$AA.DiscreteAnimation.registerClass('AjaxControlToolkit.Animation.DiscreteAnimation', $AA.PropertyAnimation);
$AA.registerAnimation('discrete', $AA.DiscreteAnimation);


$AA.InterpolatedAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
    /// <summary>
    /// The <code>InterpolatedAnimation</code> assigns a range of values between <code>startValue</code>
    /// and <code>endValue</code> to the designated property.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="property" type="String" mayBeNull="true" optional="true">
    /// Property of the <code>target</code> element to set when animating.  The default value is 'style'.
    /// </param>
    /// <param name="propertyKey" type="String" mayBeNull="true" optional="true">
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </param>
    /// <param name="startValue" type="Number" mayBeNull="true" optional="true">
    /// Start of the range of values
    /// </param>
    /// <param name="endValue" type="Number" mayBeNull="true" optional="true">
    /// End of the range of values
    /// </param>
    /// <animation>Interpolated</animation>
    $AA.InterpolatedAnimation.initializeBase(this, [target, duration, fps, ((property !== undefined) ? property : 'style'), propertyKey]);

    // Start and end values
    this._startValue = startValue;
    this._endValue = endValue;
}
$AA.InterpolatedAnimation.prototype = {
    get_startValue : function() {
        /// <value type="Number">
        /// Start of the range of values
        /// </value>
        return this._startValue;
    },
    set_startValue : function(value) {
        value = this._getFloat(value);
        if (this._startValue != value) {
            this._startValue = value;
            this.raisePropertyChanged('startValue');
        }
    },
    
    get_endValue : function() {
        /// <value type="Number">
        /// End of the range of values
        /// </value>
        return this._endValue;
    },
    set_endValue : function(value) {
        value = this._getFloat(value);
        if (this._endValue != value) {
            this._endValue = value;
            this.raisePropertyChanged('endValue');
        }
    }   
}
$AA.InterpolatedAnimation.registerClass('AjaxControlToolkit.Animation.InterpolatedAnimation', $AA.PropertyAnimation);
$AA.registerAnimation('interpolated', $AA.InterpolatedAnimation);


$AA.ColorAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue) {
    /// <summary>
    /// The <code>ColorAnimation</code> transitions the value of the <code>property</code> between
    /// two colors (although it does ignore the alpha channel). The colors must be 7-character hex strings
    /// (like <code>#246ACF</code>).
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="property" type="String" mayBeNull="true" optional="true">
    /// Property of the <code>target</code> element to set when animating.  The default value is 'style'.
    /// </param>
    /// <param name="propertyKey" type="String" mayBeNull="true" optional="true">
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </param>
    /// <param name="startValue" type="String" mayBeNull="true" optional="true">
    /// Start of the range of colors
    /// </param>
    /// <param name="endValue" type="String" mayBeNull="true" optional="true">
    /// End of the range of colors
    /// </param>
    /// <animation>Color</animation>
    $AA.ColorAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);
    
    // Cached start/end RBG triplets
    this._start = null;
    this._end = null;
    
    // Flags indicating whether each dimension of color will be interpolated
    this._interpolateRed = false;
    this._interpolateGreen = false;
    this._interpolateBlue = false;
}
$AA.ColorAnimation.prototype = {
    onStart : function() {
        /// <summary>
        /// Determine which dimensions of color will be animated
        /// </summary>
        /// <returns />
        $AA.ColorAnimation.callBaseMethod(this, 'onStart');
       
        this._start = $AA.ColorAnimation.getRGB(this.get_startValue());
        this._end = $AA.ColorAnimation.getRGB(this.get_endValue());
        
        this._interpolateRed = (this._start.Red != this._end.Red);
        this._interpolateGreen = (this._start.Green != this._end.Green);
        this._interpolateBlue = (this._start.Blue != this._end.Blue);
    },
    
    getAnimatedValue : function(percentage) {
        /// <summary>
        /// Get the interpolated color values
        /// </summary>
        /// <param name="percentage" type="Number">
        /// Percentage of the animation already complete
        /// </param>
        /// <returns type="String">
        /// Current color formatted as a 7-character hex string (like <code>#246ACF</code>).
        /// </returns>

        var r = this._start.Red;
        var g = this._start.Green;
        var b = this._start.Blue;
        
        if (this._interpolateRed)
            r = Math.round(this.interpolate(r, this._end.Red, percentage));
        
        if (this._interpolateGreen)
            g = Math.round(this.interpolate(g, this._end.Green, percentage));
        
        if (this._interpolateBlue)
            b = Math.round(this.interpolate(b, this._end.Blue, percentage));
        
        return $AA.ColorAnimation.toColor(r, g, b);
    },
    
    set_startValue : function(value) {
        /// <value type="String">
        /// Starting color of the transition formatted as a 7-character hex string (like <code>#246ACF</code>).
        /// </value>

        if (this._startValue != value) {
            this._startValue = value;
            this.raisePropertyChanged('startValue');
        }
    },
    
    set_endValue : function(value) {
        /// <value type="String">
        /// Ending color of the transition formatted as a 7-character hex string (like <code>#246ACF</code>).
        /// </value>

        if (this._endValue != value) {
            this._endValue = value;
            this.raisePropertyChanged('endValue');
        }
    }   
}
$AA.ColorAnimation.getRGB = function(color) {
    /// <summary>
    /// Convert the color to an RGB triplet
    /// </summary>
    /// <param name="color" type="String">
    /// Color formatted as a 7-character hex string (like <code>#246ACF</code>)
    /// </param>
    /// <returns type="Object">
    /// Object representing the color with <code>Red</code>, <code>Green</code>, and <code>Blue</code> properties.
    /// </returns>

    if (!color || color.length != 7) {
        throw String.format(AjaxControlToolkit.Resources.Animation_InvalidColor, color);
    }
    return { 'Red': parseInt(color.substr(1,2), 16),
             'Green': parseInt(color.substr(3,2), 16),
             'Blue': parseInt(color.substr(5,2), 16) };
}
$AA.ColorAnimation.toColor = function(red, green, blue) {
    /// <summary>
    /// Convert an RBG triplet into a 7-character hex string (like <code>#246ACF</code>)
    /// </summary>
    /// <param name="red" type="Number" integer="true">
    /// Value of the color's red dimension
    /// </param>
    /// <param name="green" type="Number" integer="true">
    /// Value of the color's green dimension
    /// </param>
    /// <param name="blue" type="Number" integer="true">
    /// Value of the color's blue dimension
    /// </param>
    /// <returns type="String">
    /// Color as a 7-character hex string (like <code>#246ACF</code>)
    /// </returns>

    var r = red.toString(16);
    var g = green.toString(16);
    var b = blue.toString(16);
    if (r.length == 1) r = '0' + r;
    if (g.length == 1) g = '0' + g;
    if (b.length == 1) b = '0' + b;
    return '#' + r + g + b;
}
$AA.ColorAnimation.registerClass('AjaxControlToolkit.Animation.ColorAnimation', $AA.InterpolatedAnimation);
$AA.registerAnimation('color', $AA.ColorAnimation);


$AA.LengthAnimation = function(target, duration, fps, property, propertyKey, startValue, endValue, unit) {
    /// <summary>
    /// The <code>LengthAnimation</code> is identical to <see cref="AjaxControlToolkit.Animation.InterpolatedAnimation" />
    /// except it adds a <code>unit</code> to the value before assigning it to the <code>property</code>.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="property" type="String" mayBeNull="true" optional="true">
    /// Property of the <code>target</code> element to set when animating.  The default value is 'style'.
    /// </param>
    /// <param name="propertyKey" type="String" mayBeNull="true" optional="true">
    /// Optional key of the property to be set (which indicates the value property[propertyKey], like style['backgroundColor']). Note that for the style property, the key must be in a JavaScript friendly format (i.e. backgroundColor instead of background-color).
    /// </param>
    /// <param name="startValue" type="Number" mayBeNull="true" optional="true">
    /// Start of the range of values
    /// </param>
    /// <param name="endValue" type="Number" mayBeNull="true" optional="true">
    /// End of the range of values
    /// </param>
    /// <param name="unit" type="String" mayBeNull="true" optional="true">
    /// Unit of the interpolated values.  The default value is <code>'px'</code>.
    /// </param>
    /// <animation>Length</animation>
    $AA.LengthAnimation.initializeBase(this, [target, duration, fps, property, propertyKey, startValue, endValue]);
    
    // Unit of length (which defaults to px)
    this._unit = (unit != null) ? unit : 'px';
}
$AA.LengthAnimation.prototype = {

    getAnimatedValue : function(percentage) {
        /// <summary>
        /// Get the interpolated length value
        /// </summary>
        /// <param name="percentage" type="Number">
        /// Percentage of the animation already complete
        /// </param>
        /// <returns type="String">
        /// Interpolated length
        /// </returns>

        var value = this.interpolate(this.get_startValue(), this.get_endValue(), percentage);
        return Math.round(value) + this._unit;
    },
    
    get_unit : function() {
        /// <value type="String">
        /// Unit of the interpolated values.  The default value is <code>'px'</code>.
        /// </value>
        return this._unit;
    },
    set_unit : function(value) {
        if (this._unit != value) {
            this._unit = value;
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.LengthAnimation.registerClass('AjaxControlToolkit.Animation.LengthAnimation', $AA.InterpolatedAnimation);
$AA.registerAnimation('length', $AA.LengthAnimation);


$AA.MoveAnimation = function(target, duration, fps, horizontal, vertical, relative, unit) {
    /// <summary>
    /// The <code>MoveAnimation</code> is used to move the <code>target</code> element. If the
    /// <code>relative</code> flag is set to <code>true</code>, then it treats the <code>horizontal</code>
    /// and <code>vertical</code> properties as offsets to move the element. If the <code>relative</code>
    /// flag is <code>false</code>, then it will treat the <code>horizontal</code> and <code>vertical</code>
    /// properties as coordinates on the page where the <code>target</code> element should be moved. It is
    /// important to note that the <code>target</code> must be positioned (i.e. <code>absolutely</code>) so
    /// that settings its <code>top</code>/<code>left<code> style attributes will change its location.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="horizontal" type="Number" mayBeNull="true" optional="true">
    /// If <code>relative</code>  is <code>true</code>, this is the offset to move horizontally. Otherwise this is the x
    /// coordinate on the page where the <code>target</code> should be moved.
    /// </param>
    /// <param name="vertical" type="Number" mayBeNull="true" optional="true">
    /// If <code>relative</code> is <code>true</code>, this is the offset to move vertically. Otherwise this is the y
    /// coordinate on the page where the <code>target</code> should be moved.
    /// </param>
    /// <param name="relative" type="Boolean" mayBeNull="true" optional="true">
    /// <code>true</code> if we are moving relative to the current position, <code>false</code> if we are moving absolutely
    /// </param>
    /// <param name="unit" type="String" mayBeNull="true" optional="true">
    /// Length unit for the size of the <code>target</code>. The default value is <code>'px'</code>.
    /// </param>
    /// <animation>Move</animation>
    $AA.MoveAnimation.initializeBase(this, [target, duration, fps, null]);

    // Distance to move horizontally and vertically
    this._horizontal = horizontal ? horizontal : 0;
    this._vertical = vertical ? vertical : 0;
    this._relative = (relative === undefined) ? true : relative;
    
    // Length animations representing the movememnts
    this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'left', null, null, unit);
    this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'top', null, null, unit);
    this.add(this._verticalAnimation);
    this.add(this._horizontalAnimation);
}
$AA.MoveAnimation.prototype = {
    
    onStart : function() {
        /// <summary>
        /// Use the <code>target</code>'s current position as the starting point for the animation
        /// </summary>
        /// <returns />
        $AA.MoveAnimation.callBaseMethod(this, 'onStart');
        
        // Set the start and end values of the animations by getting
        // the element's current position and applying the offsets
        var element = this.get_target();
        this._horizontalAnimation.set_startValue(element.offsetLeft);
        this._horizontalAnimation.set_endValue(this._relative ? element.offsetLeft + this._horizontal : this._horizontal);
        this._verticalAnimation.set_startValue(element.offsetTop); 
        this._verticalAnimation.set_endValue(this._relative ? element.offsetTop + this._vertical : this._vertical);
    },
    
    get_horizontal : function() {
        /// <value type="Number">
        /// If <code>relative</code>  is <code>true</code>, this is the offset to move horizontally. Otherwise this is the x
        /// coordinate on the page where the <code>target</code> should be moved.
        /// </value>
        return this._horizontal;
    },
    set_horizontal : function(value) {
        value = this._getFloat(value);
        if (this._horizontal != value) {
            this._horizontal = value;
            this.raisePropertyChanged('horizontal');
        }
    },
    
    get_vertical : function() {
        /// <value type="Number">
        /// If <code>relative</code> is <code>true</code>, this is the offset to move vertically. Otherwise this is the y
        /// coordinate on the page where the <code>target</code> should be moved.
        /// </value>
        return this._vertical;
    },
    set_vertical : function(value) {
        value = this._getFloat(value);
        if (this._vertical != value) {
            this._vertical = value;
            this.raisePropertyChanged('vertical');
        }
    },
    
    get_relative : function() {
        /// <value type="Boolean">
        /// <code>true</code> if we are moving relative to the current position, <code>false</code> if we are moving absolutely
        /// </value>
        return this._relative;
    },
    set_relative : function(value) {
        value = this._getBoolean(value);
        if (this._relative != value) {
            this._relative = value;
            this.raisePropertyChanged('relative');
        }
    },
    
    get_unit : function() {
        /// <value type="String" mayBeNull="true">
        /// Length unit for the size of the <code>target</code>. The default value is <code>'px'</code>.
        /// </value>
        this._horizontalAnimation.get_unit();
    },
    set_unit : function(value) {
        var unit = this._horizontalAnimation.get_unit();
        if (unit != value) {
            this._horizontalAnimation.set_unit(value);
            this._verticalAnimation.set_unit(value);
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.MoveAnimation.registerClass('AjaxControlToolkit.Animation.MoveAnimation', $AA.ParallelAnimation);
$AA.registerAnimation('move', $AA.MoveAnimation);


$AA.ResizeAnimation = function(target, duration, fps, width, height, unit) {
    /// <summary>
    /// The <code>ResizeAnimation</code> changes the size of the <code>target</code> from its
    /// current value to the specified <code>width</code> and <code>height</code>.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="width" type="Number" mayBeNull="true" optional="true">
    /// New width of the <code>target</code>
    /// </param>
    /// <param name="height" type="Number" mayBeNull="true" optional="true">
    /// New height of the <code>target</code>
    /// </param>
    /// <param name="unit" type="String" mayBeNull="true" optional="true">
    /// Length unit for the size of the <code>target</code>. The default value is <code>'px'</code>.
    /// </param>
    /// <animation>Resize</animation>
    $AA.ResizeAnimation.initializeBase(this, [target, duration, fps, null]);

    // New size of the element
    this._width = width;
    this._height = height;
    
    // Animations to set the size across both dimensions
    this._horizontalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'width', null, null, unit);
    this._verticalAnimation = new $AA.LengthAnimation(target, duration, fps, 'style', 'height', null, null, unit);
    this.add(this._horizontalAnimation);
    this.add(this._verticalAnimation);
}
$AA.ResizeAnimation.prototype = {
    
    onStart : function() {
        /// <summary>
        /// Use the <code>target</code>'s current size as the starting point for the animation
        /// </summary>
        /// <returns />

        $AA.ResizeAnimation.callBaseMethod(this, 'onStart');
        
        // Set the start and end values of the animations by getting
        // the element's current width and height
        var element = this.get_target();
        this._horizontalAnimation.set_startValue(element.offsetWidth);
        this._verticalAnimation.set_startValue(element.offsetHeight);
        this._horizontalAnimation.set_endValue((this._width !== null && this._width !== undefined) ?
            this._width : element.offsetWidth);
        this._verticalAnimation.set_endValue((this._height !== null && this._height !== undefined) ?
            this._height : element.offsetHeight);
    },
    
    get_width : function() {
        /// <value type="Number">
        /// New width of the <code>target</code>
        /// </value>

        return this._width;
    },
    set_width : function(value) {
        value = this._getFloat(value);
        if (this._width != value) {
            this._width = value;
            this.raisePropertyChanged('width');
        }
    },
    
    get_height : function() {
        /// <value type="Number">
        /// New height of the <code>target</code>
        /// </value>

        return this._height;
    },
    set_height : function(value) {
        value = this._getFloat(value);
        if (this._height != value) {
            this._height = value;   
            this.raisePropertyChanged('height');
        }
    },
    
    get_unit : function() {
        /// <value type="String">
        /// Length unit for the size of the <code>target</code>. The default value is <code>'px'</code>.
        /// </value>

        this._horizontalAnimation.get_unit();
    },
    set_unit : function(value) {
        var unit = this._horizontalAnimation.get_unit();
        if (unit != value) {
            this._horizontalAnimation.set_unit(value);
            this._verticalAnimation.set_unit(value);
            this.raisePropertyChanged('unit');
        }
    }
}
$AA.ResizeAnimation.registerClass('AjaxControlToolkit.Animation.ResizeAnimation', $AA.ParallelAnimation);
$AA.registerAnimation('resize', $AA.ResizeAnimation);









$AA.ScaleAnimation = function(target, duration, fps, scaleFactor, unit, center, scaleFont, fontUnit) {
    /// <summary>
    /// The <code>ScaleAnimation</code> scales the size of the <code>target</code> element by the given <code>scaleFactor</code>
    /// (i.e. a <code>scaleFactor</code> of <code>.5</code> will shrink it in half and a <code>scaleFactor</code> of <code>2.0</code>
    /// will double it).  If <code>scaleFont</code> is <code>true</code>, the size of the font will also scale with the element.  If
    /// <code>center</code> is <code>true</code>, then the element's center will not move as it is scaled.  It is important to note that
    /// the target must be positioned (i.e. absolutely) so that setting its <code>top</code>/<code>left</code> properties will change
    /// its location in order for <code>center</code> to have an effect.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 1.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="scaleFactor" type="Number" mayBeNull="true" optional="true">
    /// The amount to scale the <code>target</code> (a <code>scaleFactor</code> of <code>.5</code> will
    /// shrink it in half and a <code>scaleFactor</code> of <code>2.0</code> will double it). The default value is
    /// <code>1</code>, which does no scaling.
    /// </param>
    /// <param name="unit" type="String" mayBeNull="true" optional="true">
    /// Length unit for the size of the <code>target</code>.  The default value is <code>'px'</code>.
    /// </param>
    /// <param name="center" type="Boolean" mayBeNull="true" optional="true">
    /// Whether the <code>target</code> should stay centered while scaling
    /// </param>
    /// <param name="scaleFont" type="Boolean" mayBeNull="true" optional="true">
    /// Whether the font should be scaled along with the size
    /// </param>
    /// <param name="fontUnit" type="String" mayBeNull="true" optional="true">
    /// Unit of the font, which is only used if <code>scaleFont</code> is <code>true</code>.
    /// The default value is <code>'pt'</code>.
    /// </param>
    /// <animation>Scale</animation>
    $AA.ScaleAnimation.initializeBase(this, [target, duration, fps]);

    // Percentage to scale
    this._scaleFactor = (scaleFactor !== undefined) ? scaleFactor : 1;
    this._unit = (unit !== undefined) ? unit : 'px';
    
    // Center the content while scaling
    this._center = center;
    
    // Scale the font size as well
    this._scaleFont = scaleFont;
    this._fontUnit = (fontUnit !== undefined) ? fontUnit : 'pt';
    
    // Initial values
    this._element = null;
    this._initialHeight = null;
    this._initialWidth = null;
    this._initialTop = null;
    this._initialLeft = null;
    this._initialFontSize = null;
}
$AA.ScaleAnimation.prototype = {    
    getAnimatedValue : function(percentage) {
        /// <summary>
        /// Get the amount to scale the <code>target</code>
        /// </summary>
        /// <param name="percentage" type="Number">
        /// Percentage of the animation already complete
        /// </param>
        /// <returns type="Number">
        /// Percentage to scale the <code>target</code>
        /// </returns>
        return this.interpolate(1.0, this._scaleFactor, percentage);
    },
    
    onStart : function() {
        /// <summary>
        /// Cache the initial size because it will be used to determine how much to scale the element at each step of the animation
        /// </summary>
        /// <returns />
        $AA.ScaleAnimation.callBaseMethod(this, 'onStart');
        
        this._element = this.get_target();
        if (this._element) {
            this._initialHeight = this._element.offsetHeight;
            this._initialWidth = this._element.offsetWidth;
            if (this._center) {
                this._initialTop = this._element.offsetTop;
                this._initialLeft = this._element.offsetLeft;
            }
            if (this._scaleFont) {
                // Note: we're assuming this is in the same units as fontUnit
                this._initialFontSize = parseFloat(
                    $common.getCurrentStyle(this._element, 'fontSize'));
            }
        }
    },
    
    setValue : function(scale) {
        /// <summary>
        /// Scale the <code>target</code> by the given percentage
        /// </summary>
        /// <param name="scale" type="Number">
        /// Percentage to scale the <code>target</code>
        /// </param>
        /// <returns />

        if (this._element) {
            var width = Math.round(this._initialWidth * scale);
            var height = Math.round(this._initialHeight * scale);
            this._element.style.width = width + this._unit; 
            this._element.style.height = height + this._unit;
            
            if (this._center) {
                this._element.style.top = (this._initialTop +
                    Math.round((this._initialHeight - height) / 2)) + this._unit;
                this._element.style.left = (this._initialLeft +
                    Math.round((this._initialWidth - width) / 2)) + this._unit;
            }
            
            if (this._scaleFont) {
                var size = this._initialFontSize * scale;
                if (this._fontUnit == 'px' || this._fontUnit == 'pt') {
                    size = Math.round(size);
                }
                this._element.style.fontSize = size + this._fontUnit;
            }
        }
    },
    
    onEnd : function() {
        /// <summary>
        /// Wipe the cached values after the animation completes
        /// </summary>
        /// <returns />

        this._element = null;
        this._initialHeight = null;
        this._initialWidth = null;
        this._initialTop = null;
        this._initialLeft = null;
        this._initialFontSize = null;
        $AA.ScaleAnimation.callBaseMethod(this, 'onEnd');
    },
    
    get_scaleFactor : function() {
        /// <value type="Number">
        /// The amount to scale the <code>target</code> (a <code>scaleFactor</code> of <code>.5</code> will
        /// shrink it in half and a <code>scaleFactor</code> of <code>2.0</code> will double it). The default value is
        /// <code>1</code>, which does no scaling.
        /// </value>

        return this._scaleFactor;
    },
    set_scaleFactor : function(value) {
        value = this._getFloat(value);
        if (this._scaleFactor != value) {
            this._scaleFactor = value;
            this.raisePropertyChanged('scaleFactor');
        }
    },
    
    get_unit : function() {
        /// <value type="String">
        /// Length unit for the size of the <code>target</code>.  The default value is <code>'px'</code>.
        /// </value>
        return this._unit;
    },
    set_unit : function(value) {
        if (this._unit != value) {
            this._unit = value;
            this.raisePropertyChanged('unit');
        }
    },
    
    get_center : function() {
        /// <value type="Boolean">
        /// Whether the <code>target</code> should stay centered while scaling
        /// </value>
        return this._center;
    },
    set_center : function(value) {
        value = this._getBoolean(value);
        if (this._center != value) {
            this._center = value;
            this.raisePropertyChanged('center');
        }
    },
    
    get_scaleFont : function() {
        /// <value type="Boolean">
        /// Whether the font should be scaled along with the size
        /// </value>
        return this._scaleFont;
    },
    set_scaleFont : function(value) {
        value = this._getBoolean(value);
        if (this._scaleFont != value) {
            this._scaleFont = value;
            this.raisePropertyChanged('scaleFont');
        }
    },
    
    get_fontUnit : function() {
        /// <value type="String">
        /// Unit of the font, which is only used if <code>scaleFont</code> is <code>true</code>.
        /// The default value is <code>'pt'</code>.
        /// </value>
        return this._fontUnit;
    },
    set_fontUnit : function(value) {
        if (this._fontUnit != value) { 
            this._fontUnit = value; 
            this.raisePropertyChanged('fontUnit');
        }
    }
}
$AA.ScaleAnimation.registerClass('AjaxControlToolkit.Animation.ScaleAnimation', $AA.Animation);
$AA.registerAnimation('scale', $AA.ScaleAnimation);


$AA.Action = function(target, duration, fps) {
    /// <summary>
    /// <code>Action</code> is a base class for all "non-animating" animations that provides empty implementations
    /// for abstract methods and adds a <code>doAction</code> method that will be called to perform the action's
    /// operation.  While regular animations perform an operation in a sequence of small steps spread over an interval,
    /// the actions perform a single operation instantaneously.  By default, all actions have a <code>duration</code>
    /// of zero.  The actions are very useful for defining complex animations.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <animation>Action</animation>
    $AA.Action.initializeBase(this, [target, duration, fps]);

    // Set the duration to 0 if it wasn't specified
    if (duration === undefined) {
        this.set_duration(0);
    }
}
$AA.Action.prototype = {
    
    onEnd : function() {
        /// <summary>
        /// Call the <code>doAction</code> method when the animation completes
        /// </summary>
        /// <returns />
        this.doAction();
        $AA.Action.callBaseMethod(this, 'onEnd');
    },
    
    doAction : function() {
        /// <summary>
        /// The <code>doAction</code> method must be implemented by all actions
        /// </summary>
        /// <returns />
        throw Error.notImplemented();
    },
    
    getAnimatedValue : function() {
        /// <summary>
        /// Empty implementation of required abstract method
        /// </summary>
    },
    setValue : function() {
        /// <summary>
        /// Empty implementation of required abstract method
        /// </summary>
    }
}
$AA.Action.registerClass('AjaxControlToolkit.Animation.Action', $AA.Animation);
$AA.registerAnimation('action', $AA.Action);


$AA.EnableAction = function(target, duration, fps, enabled) {
    /// <summary>
    /// The <code>EnableAction</code> changes whether or not the <code>target</code> is disabled.
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="enabled" type="Boolean" mayBeNull="true" optional="true">
    /// Whether or not the <code>target</code> is disabled. The default value is <code>true</code>.
    /// </param>
    /// <animation>EnableAction</animation>
    $AA.EnableAction.initializeBase(this, [target, duration, fps]);

    // Whether to enable or disable
    this._enabled = (enabled !== undefined) ? enabled : true;
}
$AA.EnableAction.prototype = {
    doAction : function() {
    	/// <summary>
        /// Set the enabled property of the <code>target</code>
    	/// </summary>
    	/// <returns />
    	
        var element = this.get_target();
        if (element) {
            element.disabled = !this._enabled;
        }
    },
    
    get_enabled : function() {
        /// <value type="Boolean">
        /// Whether or not the <code>target</code> is disabled. The default value is <code>true</code>.
        /// </value>
        return this._enabled;
    },
    set_enabled : function(value) {
        value = this._getBoolean(value);
        if (this._enabled != value) {
            this._enabled = value;
            this.raisePropertyChanged('enabled');
        }
    }
}
$AA.EnableAction.registerClass('AjaxControlToolkit.Animation.EnableAction', $AA.Action);
$AA.registerAnimation('enableAction', $AA.EnableAction);


$AA.HideAction = function(target, duration, fps, visible) {
    /// <summary>
    /// The <code>HideAction</code> simply hides the <code>target</code> from view
    /// (by setting its style's <code>display</code> attribute to <code>'none'</code>)
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="visible" type="Boolean" mayBeNull="False">
    /// True to show the target, false to hide it.  The default value is false.
    /// </param>
    /// <animation>HideAction</animation>
    $AA.HideAction.initializeBase(this, [target, duration, fps]);

    this._visible = visible;
}
$AA.HideAction.prototype = {
    doAction : function() {
        /// <summary>
        /// Hide the <code>target</code>
        /// </summary>
        /// <returns />
        var element = this.get_target();
        if (element) {
            $common.setVisible(element, this._visible);
        }
    },
    
    get_visible : function() {
        /// <value type="Boolean" mayBeNull="False">
        /// True to show the target, false to hide it.  The default value is false.
        /// </value>
        return this._visible;
    },
    set_visible : function(value) {
        if (this._visible != value) {
            this._visible = value;
            this.raisePropertyChanged('visible');
        }
    }
}
$AA.HideAction.registerClass('AjaxControlToolkit.Animation.HideAction', $AA.Action);
$AA.registerAnimation('hideAction', $AA.HideAction);


$AA.StyleAction = function(target, duration, fps, attribute, value) {
    /// <summary>
    /// The <code>StyleAction<code> is used to set a particular <code>attribute</code> of the <code>target</code>'s style
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="attribute" type="String" mayBeNull="true" optional="true">
    /// Style attribute to set (this must be in a JavaScript friendly format, i.e. <code>backgroundColor</code>
    /// instead of <code>background-color</code>)
    /// </param>
    /// <param name="value" type="String" mayBeNull="true" optional="true">
    /// Value to set the <code>attribute</code>
    /// </param>
    /// <animation>StyleAction</animation>
    $AA.StyleAction.initializeBase(this, [target, duration, fps]);

    // Style attribute (like "backgroundColor" or "borderWidth"
    this._attribute = attribute;
    
    // Value to assign to the style attribute
    this._value = value;
    
}
$AA.StyleAction.prototype = {
    doAction : function() {
    	/// <summary>
        /// Assign the <code>value</code> to the style's <code>attribute</code>
    	/// </summary>
    	/// <returns />
        var element = this.get_target();
        if (element) {
            element.style[this._attribute] = this._value;
        }
    },
    
    get_attribute : function() {
        /// <value type="String">
        /// Style attribute to set (this must be in a JavaScript friendly format, i.e. <code>backgroundColor</code>
        /// instead of <code>background-color</code>)
        /// </value>
        return this._attribute;
    },
    set_attribute : function(value) {
        if (this._attribute != value) {
            this._attribute = value;
            this.raisePropertyChanged('attribute');
        }
    },
    
    get_value : function() {
        /// <value type="String">
        /// Value to set the <code>attribute</code>
        /// </value>
        return this._value;
    },
    set_value : function(value) {
        if (this._value != value) {
            this._value = value;
            this.raisePropertyChanged('value');
        }
    }
}
$AA.StyleAction.registerClass('AjaxControlToolkit.Animation.StyleAction', $AA.Action);
$AA.registerAnimation('styleAction', $AA.StyleAction);


$AA.OpacityAction = function(target, duration, fps, opacity) {
    /// <summary>
    /// <code>OpacityAction</code> allows you to set the <code>opacity</code> of the <code>target</code>
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="opacity" type="Number" mayBeNull="true" optional="true">
    /// Opacity to set the <code>target</code>
    /// </param>
    /// <animation>OpacityAction</animation>
    $AA.OpacityAction.initializeBase(this, [target, duration, fps]);
    
    // Opacity
    this._opacity = opacity;
}
$AA.OpacityAction.prototype = {
    doAction : function() {
    	/// <summary>
        /// Set the opacity
    	/// </summary>
    	/// <returns />
        var element = this.get_target();
        if (element) {
            $common.setElementOpacity(element, this._opacity);
        }
    },
    
    get_opacity : function() {
        /// <value type="Number">
        /// Opacity to set the <code>target</code>
        /// </value>
        return this._opacity;
    },
    set_opacity : function(value) {
        value = this._getFloat(value);
        if (this._opacity != value) {
            this._opacity = value;
            this.raisePropertyChanged('opacity');
        }
    }
}
$AA.OpacityAction.registerClass('AjaxControlToolkit.Animation.OpacityAction', $AA.Action);
$AA.registerAnimation('opacityAction', $AA.OpacityAction);


$AA.ScriptAction = function(target, duration, fps, script) {
    /// <summary>
    /// The <code>ScriptAction</code> is used to execute arbitrary JavaScript
    /// </summary>
    /// <param name="target" type="Sys.UI.DomElement" mayBeNull="true" optional="true" domElement="true">
    /// Target of the animation
    /// </param>
    /// <param name="duration" type="Number" mayBeNull="true" optional="true">
    /// Length of the animation in seconds.  The default is 0.
    /// </param>
    /// <param name="fps" type="Number" mayBeNull="true" optional="true" integer="true">
    /// Number of steps per second.  The default is 25.
    /// </param>
    /// <param name="script" type="String" mayBeNull="true" optional="true">
    /// JavaScript to execute
    /// </param>
    /// <animation>ScriptAction</animation>
    $AA.ScriptAction.initializeBase(this, [target, duration, fps]);

    // Script to execute
    this._script = script;
}
$AA.ScriptAction.prototype = {
    doAction : function() {
    	/// <summary>
        /// Execute the script
    	/// </summary>
    	/// <returns />
        try {
            eval(this._script);
        } catch (ex) {
        }
    },
    
    get_script : function() {
        /// <value type="String">
        /// JavaScript to execute
        /// </value>
        return this._script;
    },
    set_script : function(value) {
        if (this._script != value) {
            this._script = value;
            this.raisePropertyChanged('script');
        }
    }
}
$AA.ScriptAction.registerClass('AjaxControlToolkit.Animation.ScriptAction', $AA.Action);
$AA.registerAnimation('scriptAction', $AA.ScriptAction);

//END AjaxControlToolkit.Animation.Animations.js
//START AjaxControlToolkit.ExtenderBase.BaseScripts.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />


Type.registerNamespace('AjaxControlToolkit');

// This is the base behavior for all extender behaviors
AjaxControlToolkit.BehaviorBase = function(element) {
    /// <summary>
    /// Base behavior for all extender behaviors
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// Element the behavior is associated with
    /// </param>
    AjaxControlToolkit.BehaviorBase.initializeBase(this,[element]);
    
    this._clientStateFieldID = null;
    this._pageRequestManager = null;
    this._partialUpdateBeginRequestHandler = null;
    this._partialUpdateEndRequestHandler = null;
}
AjaxControlToolkit.BehaviorBase.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>

        // TODO: Evaluate necessity
        AjaxControlToolkit.BehaviorBase.callBaseMethod(this, 'initialize');
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>
        AjaxControlToolkit.BehaviorBase.callBaseMethod(this, 'dispose');

        if (this._pageRequestManager) {
            if (this._partialUpdateBeginRequestHandler) {
                this._pageRequestManager.remove_beginRequest(this._partialUpdateBeginRequestHandler);
                this._partialUpdateBeginRequestHandler = null;
            }
            if (this._partialUpdateEndRequestHandler) {
                this._pageRequestManager.remove_endRequest(this._partialUpdateEndRequestHandler);
                this._partialUpdateEndRequestHandler = null;
            }
            this._pageRequestManager = null;
        }
    },

    get_ClientStateFieldID : function() {
        /// <value type="String">
        /// ID of the hidden field used to store client state
        /// </value>
        return this._clientStateFieldID;
    },
    set_ClientStateFieldID : function(value) {
        if (this._clientStateFieldID != value) {
            this._clientStateFieldID = value;
            this.raisePropertyChanged('ClientStateFieldID');
        }
    },

    get_ClientState : function() {
        /// <value type="String">
        /// Client state
        /// </value>
        if (this._clientStateFieldID) {
            var input = document.getElementById(this._clientStateFieldID);
            if (input) {
                return input.value;
            }
        }
        return null;
    },
    set_ClientState : function(value) {
        if (this._clientStateFieldID) {
            var input = document.getElementById(this._clientStateFieldID);
            if (input) {
                input.value = value;
            }
        }
    },

    registerPartialUpdateEvents : function() {
        /// <summary>
        /// Register for beginRequest and endRequest events on the PageRequestManager,
        /// (which cause _partialUpdateBeginRequest and _partialUpdateEndRequest to be
        /// called when an UpdatePanel refreshes)
        /// </summary>

        if (Sys && Sys.WebForms && Sys.WebForms.PageRequestManager){
            this._pageRequestManager = Sys.WebForms.PageRequestManager.getInstance();
            if (this._pageRequestManager) {
                this._partialUpdateBeginRequestHandler = Function.createDelegate(this, this._partialUpdateBeginRequest);
                this._pageRequestManager.add_beginRequest(this._partialUpdateBeginRequestHandler);
                this._partialUpdateEndRequestHandler = Function.createDelegate(this, this._partialUpdateEndRequest);
                this._pageRequestManager.add_endRequest(this._partialUpdateEndRequestHandler);
            }
        }
    },

    _partialUpdateBeginRequest : function(sender, beginRequestEventArgs) {
        /// <summary>
        /// Method that will be called when a partial update (via an UpdatePanel) begins,
        /// if registerPartialUpdateEvents() has been called.
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="beginRequestEventArgs" type="Sys.WebForms.BeginRequestEventArgs">
        /// Event arguments
        /// </param>

        // Nothing done here; override this method in a child class
    },
    
    _partialUpdateEndRequest : function(sender, endRequestEventArgs) {
        /// <summary>
        /// Method that will be called when a partial update (via an UpdatePanel) finishes,
        /// if registerPartialUpdateEvents() has been called.
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="endRequestEventArgs" type="Sys.WebForms.EndRequestEventArgs">
        /// Event arguments
        /// </param>

        // Nothing done here; override this method in a child class
    }
}
AjaxControlToolkit.BehaviorBase.registerClass('AjaxControlToolkit.BehaviorBase', Sys.UI.Behavior);


// Dynamically populates content when the populate method is called
AjaxControlToolkit.DynamicPopulateBehaviorBase = function(element) {
    /// <summary>
    /// DynamicPopulateBehaviorBase is used to add DynamicPopulateBehavior funcitonality
    /// to other extenders.  It will dynamically populate the contents of the target element
    /// when its populate method is called.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM Element the behavior is associated with
    /// </param>
    AjaxControlToolkit.DynamicPopulateBehaviorBase.initializeBase(this, [element]);
    
    this._DynamicControlID = null;
    this._DynamicContextKey = null;
    this._DynamicServicePath = null;
    this._DynamicServiceMethod = null;
    this._cacheDynamicResults = false;
    this._dynamicPopulateBehavior = null;
    this._populatingHandler = null;
    this._populatedHandler = null;
}
AjaxControlToolkit.DynamicPopulateBehaviorBase.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>

        AjaxControlToolkit.DynamicPopulateBehaviorBase.callBaseMethod(this, 'initialize');

        // Create event handlers
        this._populatingHandler = Function.createDelegate(this, this._onPopulating);
        this._populatedHandler = Function.createDelegate(this, this._onPopulated);
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        // Dispose of event handlers
        if (this._populatedHandler) {
            if (this._dynamicPopulateBehavior) {
                this._dynamicPopulateBehavior.remove_populated(this._populatedHandler);
            }
            this._populatedHandler = null;
        }
        if (this._populatingHandler) {
            if (this._dynamicPopulateBehavior) {
                this._dynamicPopulateBehavior.remove_populating(this._populatingHandler);
            }
            this._populatingHandler = null;
        }

        // Dispose of the placeholder control and behavior
        if (this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        AjaxControlToolkit.DynamicPopulateBehaviorBase.callBaseMethod(this, 'dispose');
    },

    populate : function(contextKeyOverride) {
        /// <summary>
        /// Demand-create the DynamicPopulateBehavior and use it to populate the target element
        /// </summary>
        /// <param name="contextKeyOverride" type="String" mayBeNull="true" optional="true">
        /// An arbitrary string value to be passed to the web method. For example, if the element to be populated is within a data-bound repeater, this could be the ID of the current row.
        /// </param>

        // If the DynamicPopulateBehavior's element is out of date, dispose of it
        if (this._dynamicPopulateBehavior && (this._dynamicPopulateBehavior.get_element() != $get(this._DynamicControlID))) {
            this._dynamicPopulateBehavior.dispose();
            this._dynamicPopulateBehavior = null;
        }
        
        // If a DynamicPopulateBehavior is not available and the necessary information is, create one
        if (!this._dynamicPopulateBehavior && this._DynamicControlID && this._DynamicServiceMethod) {
            this._dynamicPopulateBehavior = $create(AjaxControlToolkit.DynamicPopulateBehavior,
                {
                    "id" : this.get_id() + "_DynamicPopulateBehavior",
                    "ContextKey" : this._DynamicContextKey,
                    "ServicePath" : this._DynamicServicePath,
                    "ServiceMethod" : this._DynamicServiceMethod,
                    "cacheDynamicResults" : this._cacheDynamicResults
                }, null, null, $get(this._DynamicControlID));

            // Attach event handlers
            this._dynamicPopulateBehavior.add_populating(this._populatingHandler);
            this._dynamicPopulateBehavior.add_populated(this._populatedHandler);
        }
        
        // If a DynamicPopulateBehavior is available, use it to populate the dynamic content
        if (this._dynamicPopulateBehavior) {
            this._dynamicPopulateBehavior.populate(contextKeyOverride ? contextKeyOverride : this._DynamicContextKey);
        }
    },

    _onPopulating : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate behavior's Populating event
        /// </summary>
        /// <param name="sender" type="Object">
        /// DynamicPopulate behavior
        /// </param>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event args
        /// </param>
        this.raisePopulating(eventArgs);
    },

    _onPopulated : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate behavior's Populated event
        /// </summary>
        /// <param name="sender" type="Object">
        /// DynamicPopulate behavior
        /// </param>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event args
        /// </param>
        this.raisePopulated(eventArgs);
    },

    get_dynamicControlID : function() {
        /// <value type="String">
        /// ID of the element to populate with dynamic content
        /// </value>
        return this._DynamicControlID;
    },
    get_DynamicControlID : this.get_dynamicControlID,
    set_dynamicControlID : function(value) {
        if (this._DynamicControlID != value) {
            this._DynamicControlID = value;
            this.raisePropertyChanged('dynamicControlID');
            this.raisePropertyChanged('DynamicControlID');
        }
    },
    set_DynamicControlID : this.set_dynamicControlID,

    get_dynamicContextKey : function() {
        /// <value type="String">
        /// An arbitrary string value to be passed to the web method.
        /// For example, if the element to be populated is within a
        /// data-bound repeater, this could be the ID of the current row.
        /// </value>
        return this._DynamicContextKey;
    },
    get_DynamicContextKey : this.get_dynamicContextKey,
    set_dynamicContextKey : function(value) {
        if (this._DynamicContextKey != value) {
            this._DynamicContextKey = value;
            this.raisePropertyChanged('dynamicContextKey');
            this.raisePropertyChanged('DynamicContextKey');
        }
    },
    set_DynamicContextKey : this.set_dynamicContextKey,

    get_dynamicServicePath : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The URL of the web service to call.  If the ServicePath is not defined, then we will invoke a PageMethod instead of a web service.
        /// </value>
        return this._DynamicServicePath;
    },
    get_DynamicServicePath : this.get_dynamicServicePath,
    set_dynamicServicePath : function(value) {
        if (this._DynamicServicePath != value) {
            this._DynamicServicePath = value;
            this.raisePropertyChanged('dynamicServicePath');
            this.raisePropertyChanged('DynamicServicePath');
        }
    },
    set_DynamicServicePath : this.set_dynamicServicePath,

    get_dynamicServiceMethod : function() {
        /// <value type="String">
        /// The name of the method to call on the page or web service
        /// </value>
        /// <remarks>
        /// The signature of the method must exactly match the following:
        ///     [WebMethod]
        ///     string DynamicPopulateMethod(string contextKey)
        ///     {
        ///         ...
        ///     }
        /// </remarks>
        return this._DynamicServiceMethod;
    },
    get_DynamicServiceMethod : this.get_dynamicServiceMethod,
    set_dynamicServiceMethod : function(value) {
        if (this._DynamicServiceMethod != value) {
            this._DynamicServiceMethod = value;
            this.raisePropertyChanged('dynamicServiceMethod');
            this.raisePropertyChanged('DynamicServiceMethod');
        }
    },
    set_DynamicServiceMethod : this.set_dynamicServiceMethod,
    
    get_cacheDynamicResults : function() {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether the results of the dynamic population should be cached and
        /// not fetched again after the first load
        /// </value>
        return this._cacheDynamicResults;
    },
    set_cacheDynamicResults : function(value) {
        if (this._cacheDynamicResults != value) {
            this._cacheDynamicResults = value;
            this.raisePropertyChanged('cacheDynamicResults');
        }
    },
    
    add_populated : function(handler) {
        /// <summary>
        /// Add a handler on the populated event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().addHandler("populated", handler);
    },
    remove_populated : function(handler) {
        /// <summary>
        /// Remove a handler from the populated event
        /// </summary>
        /// <param name="handler" type="Function">
        /// Handler
        /// </param>
        this.get_events().removeHandler("populated", handler);
    },
    raisePopulated : function(arg) {
        /// <summary>
        /// Raise the populated event
        /// </summary>
        /// <param name="arg" type="Sys.EventArgs">
        /// Event arguments
        /// </param>
        var handler = this.get_events().getHandler("populated");  
        if (handler) handler(this, arg);
    },
    
    add_populating : function(handler) {
        /// <summary>
        /// Add an event handler for the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populating', handler);
    },
    remove_populating : function(handler) {
        /// <summary>
        /// Remove an event handler from the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating : function(eventArgs) {
        /// <summary>
        /// Raise the populating event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the populating event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('populating');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
AjaxControlToolkit.DynamicPopulateBehaviorBase.registerClass('AjaxControlToolkit.DynamicPopulateBehaviorBase', AjaxControlToolkit.BehaviorBase);


AjaxControlToolkit.ControlBase = function(element) {
    AjaxControlToolkit.ControlBase.initializeBase(this, [element]);
    this._clientStateField = null;
    this._callbackTarget = null;
    this._onsubmit$delegate = Function.createDelegate(this, this._onsubmit);
    this._oncomplete$delegate = Function.createDelegate(this, this._oncomplete);
    this._onerror$delegate = Function.createDelegate(this, this._onerror);
}
AjaxControlToolkit.ControlBase.prototype = {
    initialize : function() {
        AjaxControlToolkit.ControlBase.callBaseMethod(this, "initialize");
        // load the client state if possible
        if (this._clientStateField) {
            this.loadClientState(this._clientStateField.value);
        }
        // attach an event to save the client state before a postback or updatepanel partial postback
        if (typeof(Sys.WebForms)!=="undefined" && typeof(Sys.WebForms.PageRequestManager)!=="undefined") {
            Array.add(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);
        } else {
            $addHandler(document.forms[0], "submit", this._onsubmit$delegate);
        }
    },
    dispose : function() {
        if (typeof(Sys.WebForms)!=="undefined" && typeof(Sys.WebForms.PageRequestManager)!=="undefined") {
            Array.remove(Sys.WebForms.PageRequestManager.getInstance()._onSubmitStatements, this._onsubmit$delegate);
        } else {
            $removeHandler(document.forms[0], "submit", this._onsubmit$delegate);
        }
        AjaxControlToolkit.ControlBase.callBaseMethod(this, "dispose");
    },
    findElement : function(id) {
        // <summary>Finds an element within this control (ScriptControl/ScriptUserControl are NamingContainers);
        return $get(this.get_id() + '_' + id.split(':').join('_'));
    },
    get_clientStateField : function() {
        return this._clientStateField;
    },
    set_clientStateField : function(value) {
        if (this.get_isInitialized()) throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_CannotSetClientStateField);
        if (this._clientStateField != value) {
            this._clientStateField = value;
            this.raisePropertyChanged('clientStateField');
        }
    },
    loadClientState : function(value) {
        /// <remarks>override this method to intercept client state loading after a callback</remarks>
    },
    saveClientState : function() {
        /// <remarks>override this method to intercept client state acquisition before a callback</remarks>
        return null;
    },
    _invoke : function(name, args, cb) {
        /// <summary>invokes a callback method on the server control</summary>        
        if (!this._callbackTarget) {
            throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_ControlNotRegisteredForCallbacks);
        }
        if (typeof(WebForm_DoCallback)==="undefined") {
            throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_PageNotRegisteredForCallbacks);
        }
        var ar = [];
        for (var i = 0; i < args.length; i++) 
            ar[i] = args[i];
        var clientState = this.saveClientState();
        if (clientState != null && !String.isInstanceOfType(clientState)) {
            throw Error.invalidOperation(AjaxControlToolkit.Resources.ExtenderBase_InvalidClientStateType);
        }
        var payload = Sys.Serialization.JavaScriptSerializer.serialize({name:name,args:ar,state:this.saveClientState()});
        WebForm_DoCallback(this._callbackTarget, payload, this._oncomplete$delegate, cb, this._onerror$delegate, true);
    },
    _oncomplete : function(result, context) {
        result = Sys.Serialization.JavaScriptSerializer.deserialize(result);
        if (result.error) {
            throw Error.create(result.error);
        }
        this.loadClientState(result.state);
        context(result.result);
    },
    _onerror : function(message, context) {
        throw Error.create(message);
    },
    _onsubmit : function() {
        if (this._clientStateField) {
            this._clientStateField.value = this.saveClientState();
        }
        return true;
    }    
   
}
AjaxControlToolkit.ControlBase.registerClass("AjaxControlToolkit.ControlBase", Sys.UI.Control);

AjaxControlToolkit.Resources={
"PasswordStrength_InvalidWeightingRatios":"Strength Weighting ratios must have 4 elements","Animation_ChildrenNotAllowed":"AjaxControlToolkit.Animation.createAnimation cannot add child animations to type \"{0}\" that does not derive from AjaxControlToolkit.Animation.ParentAnimation","PasswordStrength_RemainingSymbols":"{0} symbol characters","ExtenderBase_CannotSetClientStateField":"clientStateField can only be set before initialization","RTE_PreviewHTML":"Preview HTML","RTE_JustifyCenter":"Justify Center","PasswordStrength_RemainingUpperCase":"{0} more upper case characters","Animation_TargetNotFound":"AjaxControlToolkit.Animation.Animation.set_animationTarget requires the ID of a Sys.UI.DomElement or Sys.UI.Control.  No element or control could be found corresponding to \"{0}\"","RTE_FontColor":"Font Color","RTE_LabelColor":"Label Color","Common_InvalidBorderWidthUnit":"A unit type of \"{0}\"\u0027 is invalid for parseBorderWidth","RTE_Heading":"Heading","Tabs_PropertySetBeforeInitialization":"{0} cannot be changed before initialization","RTE_OrderedList":"Ordered List","ReorderList_DropWatcherBehavior_NoChild":"Could not find child of list with id \"{0}\"","CascadingDropDown_MethodTimeout":"[Method timeout]","RTE_Columns":"Columns","RTE_InsertImage":"Insert Image","RTE_InsertTable":"Insert Table","RTE_Values":"Values","RTE_OK":"OK","ExtenderBase_PageNotRegisteredForCallbacks":"This Page has not been registered for callbacks","Animation_NoDynamicPropertyFound":"AjaxControlToolkit.Animation.createAnimation found no property corresponding to \"{0}\" or \"{1}\"","Animation_InvalidBaseType":"AjaxControlToolkit.Animation.registerAnimation can only register types that inherit from AjaxControlToolkit.Animation.Animation","RTE_UnorderedList":"Unordered List","ResizableControlBehavior_InvalidHandler":"{0} handler not a function, function name, or function text","Animation_InvalidColor":"Color must be a 7-character hex representation (e.g. #246ACF), not \"{0}\"","RTE_CellColor":"Cell Color","PasswordStrength_RemainingMixedCase":"Mixed case characters","RTE_Italic":"Italic","CascadingDropDown_NoParentElement":"Failed to find parent element \"{0}\"","ValidatorCallout_DefaultErrorMessage":"This control is invalid","RTE_Indent":"Indent","ReorderList_DropWatcherBehavior_CallbackError":"Reorder failed, see details below.\\r\\n\\r\\n{0}","PopupControl_NoDefaultProperty":"No default property supported for control \"{0}\" of type \"{1}\"","RTE_Normal":"Normal","PopupExtender_NoParentElement":"Couldn\u0027t find parent element \"{0}\"","RTE_ViewValues":"View Values","RTE_Legend":"Legend","RTE_Labels":"Labels","RTE_CellSpacing":"Cell Spacing","PasswordStrength_RemainingNumbers":"{0} more numbers","RTE_Border":"Border","RTE_Create":"Create","RTE_BackgroundColor":"Background Color","RTE_Cancel":"Cancel","RTE_JustifyFull":"Justify Full","RTE_JustifyLeft":"Justify Left","RTE_Cut":"Cut","ResizableControlBehavior_CannotChangeProperty":"Changes to {0} not supported","RTE_ViewSource":"View Source","Common_InvalidPaddingUnit":"A unit type of \"{0}\" is invalid for parsePadding","RTE_Paste":"Paste","ExtenderBase_ControlNotRegisteredForCallbacks":"This Control has not been registered for callbacks","Calendar_Today":"Today: {0}","Common_DateTime_InvalidFormat":"Invalid format","ListSearch_DefaultPrompt":"Type to search","CollapsiblePanel_NoControlID":"Failed to find element \"{0}\"","RTE_ViewEditor":"View Editor","RTE_BarColor":"Bar Color","PasswordStrength_DefaultStrengthDescriptions":"NonExistent;Very Weak;Weak;Poor;Almost OK;Barely Acceptable;Average;Good;Strong;Excellent;Unbreakable!","RTE_Inserttexthere":"Insert text here","Animation_UknownAnimationName":"AjaxControlToolkit.Animation.createAnimation could not find an Animation corresponding to the name \"{0}\"","ExtenderBase_InvalidClientStateType":"saveClientState must return a value of type String","Rating_CallbackError":"An unhandled exception has occurred:\\r\\n{0}","Tabs_OwnerExpected":"owner must be set before initialize","DynamicPopulate_WebServiceTimeout":"Web service call timed out","PasswordStrength_RemainingLowerCase":"{0} more lower case characters","Animation_MissingAnimationName":"AjaxControlToolkit.Animation.createAnimation requires an object with an AnimationName property","RTE_JustifyRight":"Justify Right","Tabs_ActiveTabArgumentOutOfRange":"Argument is not a member of the tabs collection","RTE_CellPadding":"Cell Padding","RTE_ClearFormatting":"Clear Formatting","AlwaysVisible_ElementRequired":"AjaxControlToolkit.AlwaysVisibleControlBehavior must have an element","Slider_NoSizeProvided":"Please set valid values for the height and width attributes in the slider\u0027s CSS classes","DynamicPopulate_WebServiceError":"Web Service call failed: {0}","PasswordStrength_StrengthPrompt":"Strength: ","PasswordStrength_RemainingCharacters":"{0} more characters","PasswordStrength_Satisfied":"Nothing more required","RTE_Hyperlink":"Hyperlink","Animation_NoPropertyFound":"AjaxControlToolkit.Animation.createAnimation found no property corresponding to \"{0}\"","PasswordStrength_InvalidStrengthDescriptionStyles":"Text Strength description style classes must match the number of text descriptions.","PasswordStrength_GetHelpRequirements":"Get help on password requirements","PasswordStrength_InvalidStrengthDescriptions":"Invalid number of text strength descriptions specified","RTE_Underline":"Underline","Tabs_PropertySetAfterInitialization":"{0} cannot be changed after initialization","RTE_Rows":"Rows","RTE_Redo":"Redo","RTE_Size":"Size","RTE_Undo":"Undo","RTE_Bold":"Bold","RTE_Copy":"Copy","RTE_Font":"Font","CascadingDropDown_MethodError":"[Method error {0}]","RTE_BorderColor":"Border Color","RTE_Paragraph":"Paragraph","RTE_InsertHorizontalRule":"Insert Horizontal Rule","Common_UnitHasNoDigits":"No digits","RTE_Outdent":"Outdent","Common_DateTime_InvalidTimeSpan":"\"{0}\" is not a valid TimeSpan format","Animation_CannotNestSequence":"AjaxControlToolkit.Animation.SequenceAnimation cannot be nested inside AjaxControlToolkit.Animation.ParallelAnimation","Shared_BrowserSecurityPreventsPaste":"Your browser security settings don\u0027t permit the automatic execution of paste operations. Please use the keyboard shortcut Ctrl+V instead."};
//END AjaxControlToolkit.ExtenderBase.BaseScripts.js
//START AjaxControlToolkit.Animation.AnimationBehavior.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Animation/Animations.js" />


Type.registerNamespace('AjaxControlToolkit.Animation');

AjaxControlToolkit.Animation.AnimationBehavior = function(element) {
    /// <summary>
    /// The AnimationBehavior allows us to associate animations (described by JSON) with events and
    /// have them play when the events are fired.  It relies heavily on the AJAX Control Toolkit
    /// animation framework provided in Animation.js, and the GenericAnimationBehavior defined below.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// The DOM element the behavior is associated with
    /// </param>
    AjaxControlToolkit.Animation.AnimationBehavior.initializeBase(this, [element]);
    
    // Generic animation behaviors that automatically build animations from JSON descriptions
    this._onLoad = null;
    this._onClick = null;
    this._onMouseOver = null;
    this._onMouseOut = null;
    this._onHoverOver = null;
    this._onHoverOut = null;
    
    // Handlers for the events
    this._onClickHandler = null;
    this._onMouseOverHandler = null;
    this._onMouseOutHandler = null;
}
AjaxControlToolkit.Animation.AnimationBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Setup the animations/handlers
        /// </summary>
        /// <returns />
        AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'initialize');
        
        // Wireup the event handlers
        var element = this.get_element();
        if (element) {
            this._onClickHandler = Function.createDelegate(this, this.OnClick);
            $addHandler(element, 'click', this._onClickHandler);
            this._onMouseOverHandler = Function.createDelegate(this, this.OnMouseOver);
            $addHandler(element, 'mouseover', this._onMouseOverHandler);
            this._onMouseOutHandler = Function.createDelegate(this, this.OnMouseOut);
            $addHandler(element, 'mouseout', this._onMouseOutHandler);
        }
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose of the animations/handlers
        /// </summary>
        /// <returns />
        
        // Remove the event handlers
        var element = this.get_element();
        if (element) {
            if (this._onClickHandler) {
                $removeHandler(element, 'click', this._onClickHandler);
                this._onClickHandler = null;
            }
            if (this._onMouseOverHandler) {
                $removeHandler(element, 'mouseover', this._onMouseOverHandler);
                this._onMouseOverHandler = null;
            }
            if (this._onMouseOutHandler) {
                $removeHandler(element, 'mouseout', this._onMouseOutHandler);
                this._onMouseOutHandler = null;
            }
        }
        
        // Wipe the behaviors (we don't need to dispose them because
        // that will happen automatically in our base dispose)
        this._onLoad = null;
        this._onClick = null;
        this._onMouseOver = null;
        this._onMouseOut = null;
        this._onHoverOver = null;
        this._onHoverOut = null;
        
        AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'dispose');
    },
    
    
    
    get_OnLoad : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnLoad Animation's JSON definition
        /// </value>
        /// <remarks>
        /// Setting the OnLoad property will cause it to be played immediately
        /// </remarks>
        return this._onLoad ? this._onLoad.get_json() : null;
    },
    set_OnLoad : function(value) {
        if (!this._onLoad) {
            this._onLoad = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onLoad.initialize();
        }
        this._onLoad.set_json(value);
        this.raisePropertyChanged('OnLoad');
        this._onLoad.play();
    },
    
    get_OnLoadBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnLoad Animation's behavior
        /// </value>
        return this._onLoad;
    },
    
    
    
    get_OnClick : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnClick Animation's JSON definition
        /// </value>
        return this._onClick ? this._onClick.get_json() : null;
    },
    set_OnClick : function(value) {
        if (!this._onClick) {
            this._onClick = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onClick.initialize();
        }
        this._onClick.set_json(value);
        this.raisePropertyChanged('OnClick');
    },
    
    get_OnClickBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnClick Animation's behavior
        /// </value>
        return this._onClick;
    },
    
    OnClick : function() {
        /// <summary>
        /// Play the OnClick animation
        /// </summary>
        /// <returns />
        if (this._onClick) {
            this._onClick.play();
        }
    },
    
    
    
    get_OnMouseOver : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnMouseOver Animation's JSON definition
        /// </value>
        return this._onMouseOver ? this._onMouseOver.get_json() : null;
    },
    set_OnMouseOver : function(value) {
        if (!this._onMouseOver) {
            this._onMouseOver = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onMouseOver.initialize();
        }
        this._onMouseOver.set_json(value);
        this.raisePropertyChanged('OnMouseOver');
    },
    
    get_OnMouseOverBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnMouseOver Animation's behavior
        /// </value>
        return this._onMouseOver;
    },
    
    OnMouseOver : function() {
        /// <summary>
        /// Play the OnMouseOver/OnHoverOver animations
        /// </summary>
        /// <returns />
        if (this._onMouseOver) {
            this._onMouseOver.play();
        }
        if (this._onHoverOver) {
            if (this._onHoverOut) {
                this._onHoverOut.quit();
            }
            this._onHoverOver.play();
        }
    },
    
    
    
    get_OnMouseOut : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnMouseOut Animation's JSON definition
        /// </value>
        return this._onMouseOut ? this._onMouseOut.get_json() : null;
    },
    set_OnMouseOut : function(value) {
        if (!this._onMouseOut) {
            this._onMouseOut = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onMouseOut.initialize();
        }
        this._onMouseOut.set_json(value);
        this.raisePropertyChanged('OnMouseOut');
    },
    
    get_OnMouseOutBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnMouseOut Animation's behavior
        /// </value>
        return this._onMouseOut;
    },
    
    OnMouseOut : function() {
        /// <summary>
        /// Play the OnMouseOver/OnHoverOver animations
        /// </summary>
        /// <returns />
        if (this._onMouseOut) {
            this._onMouseOut.play();
        }
        if (this._onHoverOut) {
            if (this._onHoverOver) {
                this._onHoverOver.quit();
            }
            this._onHoverOut.play();
        }
    },
    
    
    
    get_OnHoverOver : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHoverOver Animation's JSON definition
        /// </value>
        return this._onHoverOver ? this._onHoverOver.get_json() : null;
    },
    set_OnHoverOver : function(value) {
        if (!this._onHoverOver) {
            this._onHoverOver = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onHoverOver.initialize();
        }
        this._onHoverOver.set_json(value);
        this.raisePropertyChanged('OnHoverOver');
    },
    
    get_OnHoverOverBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnHoverOver Animation's behavior
        /// </value>
        return this._onHoverOver;
    },
    
    
    
    get_OnHoverOut : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHoverOut Animation's JSON definition
        /// </value>
        return this._onHoverOut ? this._onHoverOut.get_json() : null;
    },
    set_OnHoverOut : function(value) {
        if (!this._onHoverOut) {
            this._onHoverOut = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onHoverOut.initialize();
        }
        this._onHoverOut.set_json(value);
        this.raisePropertyChanged('OnHoverOut');
    },
    
    get_OnHoverOutBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnHoverOut Animation's behavior
        /// </value>
        return this._onHoverOut;
    }
}
AjaxControlToolkit.Animation.AnimationBehavior.registerClass('AjaxControlToolkit.Animation.AnimationBehavior', AjaxControlToolkit.BehaviorBase);
//    getDescriptor : function() {
//        /// <summary>
//        /// Create a type descriptor
//        /// </summary>
//        /// <returns type="???">Type descriptor</returns>
//    
//        var descriptor = AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'getDescriptor');
//        descriptor.addProperty('OnLoad', String); 
//        descriptor.addProperty('OnClick', String); 
//        descriptor.addProperty('OnMouseOver', String); 
//        descriptor.addProperty('OnMouseOut', String); 
//        descriptor.addProperty('OnHoverOver', String); 
//        descriptor.addProperty('OnHoverOut', String); 
//        return descriptor;
//    },


AjaxControlToolkit.Animation.GenericAnimationBehavior = function(element) {
    /// <summary>
    /// The GenericAnimationBehavior handles the creation, playing, and disposing of animations
    /// created from a JSON description.  As we intend to expose a lot of generic animations
    /// across the Toolkit, this behavior serves to simplify the amount of work required.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// The DOM element the behavior is associated with
    /// </param>
    AjaxControlToolkit.Animation.GenericAnimationBehavior.initializeBase(this, [element]);
    
    // JSON description of the animation that will be used to create it
    this._json = null;
    
    // Animation created from the JSON description that will be played
    this._animation = null;
}
AjaxControlToolkit.Animation.GenericAnimationBehavior.prototype = {
    dispose : function() {
        /// <summary>
        /// Dispose the behavior and its animation
        /// </summary>
        /// <returns />
        this.disposeAnimation();
        AjaxControlToolkit.Animation.GenericAnimationBehavior.callBaseMethod(this, 'dispose');
    },
    
    disposeAnimation : function() {
        /// <summary>
        /// Dispose the animation
        /// </summary>
        /// <returns />
        if (this._animation) {
            this._animation.dispose();
        }
        this._animation = null;
    },
    
    play : function() {
        /// <summary>
        /// Play the animation if it isn't already playing.  If it's already playing, this does nothing.
        /// </summary>
        /// <returns />
        if (this._animation && !this._animation.get_isPlaying()) {
            this.stop();
            this._animation.play();
        }
    },
    
    stop : function() {
        /// <summary>
        /// Stop the animation if it's already playing
        /// </summary>
        /// <returns />
        if (this._animation) {
            if (this._animation.get_isPlaying()) {
                this._animation.stop(true);
            }
        }
    },
    
    quit : function() {
        /// <summary>
        /// Quit playing the animation without updating the final state (i.e. if
        /// the animation was moving, this would leave it in the middle of its path).
        /// </summary>
        /// <returns />
        /// <remarks>
        /// This differs from the stop function which will update the final state.  The
        /// quit function is most useful for scenarios where you're toggling back and forth
        /// between two animations (like those used in OnHoverOver/OnHoverOut) and you don't
        /// want to completely finish one animation if its counterpart is triggered.
        /// </remarks>
        if (this._animation) {
            if (this._animation.get_isPlaying()) {
                this._animation.stop(false);
            }
        }
    },
    
    get_json : function() {
        /// <value type="String" mayBeNull="true">
        /// JSON animation description
        /// </value>
        return this._json;
    },
    set_json : function(value) {
        // Only wipe and rebuild if they're changing the value
        if (this._json != value) {
            this._json = value;
            this.raisePropertyChanged('json');
            
            // Build the new animation
            this.disposeAnimation();
            var element = this.get_element();
            if (element) {
                this._animation = AjaxControlToolkit.Animation.buildAnimation(this._json, element);
                if (this._animation) {
                    this._animation.initialize();
                }
                this.raisePropertyChanged('animation');
            }
        }
    },
    
    get_animation : function() {
        /// <value type="AjaxControlToolkit.Animation.Animation">
        /// Animation created from the JSON description
        /// </value>
        return this._animation;
    }
}
AjaxControlToolkit.Animation.GenericAnimationBehavior.registerClass('AjaxControlToolkit.Animation.GenericAnimationBehavior', AjaxControlToolkit.BehaviorBase);
//    getDescriptor : function() {
//        /// <summary>
//        /// Get a type descriptor
//        /// </summary>
//        /// <returns type="???>Type descriptor</returns>
//        
//        var descriptor = AjaxControlToolkit.Animation.AnimationBehavior.callBaseMethod(this, 'getDescriptor');
//        descriptor.addProperty('json', String); 
//        descriptor.addProperty('animation', Object, true); 
//        return descriptor;
//    },

//END AjaxControlToolkit.Animation.AnimationBehavior.js
//START AjaxControlToolkit.PopupExtender.PopupBehavior.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />


Type.registerNamespace('AjaxControlToolkit');

AjaxControlToolkit.PopupBehavior = function(element) {
    /// <summary>
    /// The PopupBehavior is used to show/hide an element at a position
    /// relative to another element
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" mayBeNull="false" domElement="true">
    /// The DOM element the behavior is associated with
    /// </param>
    AjaxControlToolkit.PopupBehavior.initializeBase(this, [element]);

    this._x = 0;
    this._y = 0;
    this._positioningMode = AjaxControlToolkit.PositioningMode.Absolute;
    this._parentElement = null;
    this._parentElementID = null;
    this._moveHandler = null;
    this._firstPopup = true;    
    this._originalParent = null;
    this._visible = false;
    
    // Generic animation behaviors that automatically build animations
    // from JSON descriptions
    this._onShow = null;
    this._onShowEndedHandler = null;
    this._onHide = null;
    this._onHideEndedHandler = null;
}
AjaxControlToolkit.PopupBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the PopupBehavior
        /// </summary>
        AjaxControlToolkit.PopupBehavior.callBaseMethod(this, 'initialize');
        
        this._hidePopup();
        this.get_element().style.position = "absolute";
        
        // Create handlers for the animation ended events
        this._onShowEndedHandler = Function.createDelegate(this, this._onShowEnded);
        this._onHideEndedHandler = Function.createDelegate(this, this._onHideEnded);
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the PopupBehavior
        /// </summary>
    
        var element = this.get_element();
        if (element) {
            if (this._visible) {
                this.hide();
            }
            if (this._originalParent) {
                element.parentNode.removeChild(element);
                this._originalParent.appendChild(element);
                this._originalParent = null;
            }
            
            // Remove expando properties
            element._hideWindowedElementsIFrame = null;
        }
        this._parentElement = null;

        // Remove the animation ended events and wipe the animations
        // (we don't need to dispose them because that will happen
        // automatically in our base dispose)
        if (this._onShow && this._onShow.get_animation() && this._onShowEndedHandler) {
            this._onShow.get_animation().remove_ended(this._onShowEndedHandler);
        }
        this._onShowEndedHandler = null;
        this._onShow = null;
        if (this._onHide && this._onHide.get_animation() && this._onHideEndedHandler) {
            this._onHide.get_animation().remove_ended(this._onHideEndedHandler);
        }
        this._onHideEndedHandler = null;
        this._onHide = null;
        
        AjaxControlToolkit.PopupBehavior.callBaseMethod(this, 'dispose');
    },
    
    show : function() {
        /// <summary>
        /// Show the popup
        /// </summary>
        
        // Ignore requests to hide multiple times
        if (this._visible) {
            return;
        }
        
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseShowing(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
        
        // Either show the popup or play an animation that does
        // (note: even if we're animating, we still show and position
        // the popup before hiding it again and playing the animation
        // which makes the animation much simpler)
        this._visible = true;
        var element = this.get_element();
        $common.setVisible(element, true);
        this.setupPopup();
        if (this._onShow) {
            $common.setVisible(element, false);
            this.onShow();
        } else {
            this.raiseShown(Sys.EventArgs.Empty);
        }
    },
    
    hide : function() {
        /// <summary>
        /// Hide the popup
        /// </summary>
        
        // Ignore requests to hide multiple times
        if (!this._visible) {
            return;
        }
        
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseHiding(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }

        // Either hide the popup or play an animation that does
        this._visible = false;
        if (this._onHide) {
            this.onHide();
        } else {
            this._hidePopup();
            this._hideCleanup();
        }
    },
    
    getBounds : function() {
        /// <summary>
        /// Get the expected bounds of the popup relative to its parent
        /// </summary>
        /// <returns type="Sys.UI.Bounds" mayBeNull="false">
        /// Bounds of the popup relative to its parent
        /// </returns>
        /// <remarks>
        /// The actual final position can only be calculated after it is
        /// initially set and we can verify it doesn't bleed off the edge
        /// of the screen.
        /// </remarks>
    
        var element = this.get_element();
        
        // offsetParent (doc element if absolutely positioned or no offsetparent available)
        var offsetParent = element.offsetParent || document.documentElement;

        // diff = difference in position between element's offsetParent and the element we will attach popup to.
        // this is basically so we can position the popup in the right spot even though it may not be absolutely positioned
        var diff;
        var parentBounds;
        if (this._parentElement) {
            // we will be positioning the element against the assigned parent
            parentBounds = $common.getBounds(this._parentElement);
            
            var offsetParentLocation = $common.getLocation(offsetParent);
            diff = {x: parentBounds.x - offsetParentLocation.x, y:parentBounds.y - offsetParentLocation.y};
        } else {
            // we will be positioning the element against the offset parent by default, since no parent element given
            parentBounds = $common.getBounds(offsetParent);
            diff = {x:0, y:0};
        }

        // width/height of the element, needed for calculations that involve width like centering
        var width = element.offsetWidth - (element.clientLeft ? element.clientLeft * 2 : 0);
        var height = element.offsetHeight - (element.clientTop ? element.clientTop * 2 : 0);
        
        var position;
        switch (this._positioningMode) {
            case AjaxControlToolkit.PositioningMode.Center:
                position = {
                    x: Math.round(parentBounds.width / 2 - width / 2),
                    y: Math.round(parentBounds.height / 2 - height / 2)
                };
                break;
            case AjaxControlToolkit.PositioningMode.BottomLeft:
                position = {
                    x: 0,
                    y: parentBounds.height
                };
                break;
            case AjaxControlToolkit.PositioningMode.BottomRight:
                position = {
                    x: parentBounds.width - width,
                    y: parentBounds.height
                };
                break;
            case AjaxControlToolkit.PositioningMode.TopLeft:
                position = {
                    x: 0,
                    y: -element.offsetHeight
                };
                break;
            case AjaxControlToolkit.PositioningMode.TopRight:
                position = {
                    x: parentBounds.width - width,
                    y: -element.offsetHeight
                };
                break;
            default:
                position = {x: 0, y: 0};
        }
        position.x += this._x + diff.x;
        position.y += this._y + diff.y;
        
        return new Sys.UI.Bounds(position.x, position.y, width, height);
    },

    adjustPopupPosition : function(bounds) {
        /// <summary>
        /// Adjust the position of the popup after it's originally bet set
        /// to make sure that it's visible on the page.
        /// </summary>
        /// <param name="bounds" type="Sys.UI.Bounds" mayBeNull="true" optional="true">
        /// Original bounds of the parent element
        /// </param>

        var element = this.get_element();
        if (!bounds) {
            bounds = this.getBounds();
        }

        // 23098: Setting the width causes the element to grow by border+passing every
        // time.  But not setting it causes strange behavior in safari. Just set it once.
        if (this._firstPopup) {
            element.style.width = bounds.width + "px";
            this._firstPopup = false;
        }

        // Get the new bounds now that we've shown the popup
        var newPosition = $common.getBounds(element);
        var updateNeeded = false;

        if (newPosition.x < 0) {
            bounds.x -= newPosition.x;
            updateNeeded = true;
        }
        if (newPosition.y < 0) {
            bounds.y -= newPosition.y;
            updateNeeded = true;
        }

        // If the popup was off the screen, reposition it
        if (updateNeeded) {
            $common.setLocation(element, bounds);
        }
    },
    
    addBackgroundIFrame : function() {
        /// <summary>
        /// Add an empty IFRAME behind the popup (for IE6 only) so that SELECT, etc., won't
        /// show through the popup.
        /// </summary>
    
        // Get the child frame
        var element = this.get_element();
        if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.version < 7)) {
            var childFrame = element._hideWindowedElementsIFrame;
            
            // Create the child frame if it wasn't found
            if (!childFrame) {
                childFrame = document.createElement("iframe");
                childFrame.src = "javascript:'<html></html>';";
                childFrame.style.position = "absolute";
                childFrame.style.display = "none";
                childFrame.scrolling = "no";
                childFrame.frameBorder = "0";
                childFrame.tabIndex = "-1";
                childFrame.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)";
                element.parentNode.insertBefore(childFrame, element);
                element._hideWindowedElementsIFrame = childFrame;
                this._moveHandler = Function.createDelegate(this, this._onMove);
                Sys.UI.DomEvent.addHandler(element, "move", this._moveHandler);
            }
            
            // Position the frame exactly behind the element
            $common.setBounds(childFrame, $common.getBounds(element));
            childFrame.style.display = element.style.display;
            if (element.currentStyle && element.currentStyle.zIndex) {
                childFrame.style.zIndex = element.currentStyle.zIndex;
            } else if (element.style.zIndex) {
                childFrame.style.zIndex = element.style.zIndex;
            }
        }
    },
    
    setupPopup : function() {
        /// <summary>
        /// Position the popup relative to its parent
        /// </summary>
        
        var element = this.get_element();
        var bounds = this.getBounds();
        $common.setLocation(element, bounds);

        // Tweak the position, set the zIndex, and add the background iframe in IE6
        this.adjustPopupPosition(bounds);
        element.zIndex = 1000;
        this.addBackgroundIFrame();
    },
    
    _hidePopup : function() {
        /// <summary>
        /// Internal hide implementation
        /// </summary>
        
        var element = this.get_element();
        $common.setVisible(element, false);
        if (element.originalWidth) {
            element.style.width = element.originalWidth + "px";
            element.originalWidth = null;
        }
    },
    
    _hideCleanup : function() {
        /// <summary>
        /// Perform cleanup after hiding the element
        /// </summary>
    
        var element = this.get_element();
        
        // Remove the tracking handler
        if (this._moveHandler) {
            Sys.UI.DomEvent.removeHandler(element, "move", this._moveHandler);
            this._moveHandler = null;
        }
        
        // Hide the child frame
        if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
            var childFrame = element._hideWindowedElementsIFrame;
            if (childFrame) {
                childFrame.style.display = "none";
            }
        }
        
        this.raiseHidden(Sys.EventArgs.Empty);
    },
    
    _onMove : function() {
        /// <summary>
        /// Track the popup's movements so the hidden IFrame (IE6 only) can
        /// be moved along with it
        /// </summary>
        
        var element = this.get_element();
        if (element._hideWindowedElementsIFrame) {
            element.parentNode.insertBefore(element._hideWindowedElementsIFrame, element);
            element._hideWindowedElementsIFrame.style.top = element.style.top;
            element._hideWindowedElementsIFrame.style.left = element.style.left;
        }
    },
    
    get_onShow : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnShow Animation's JSON definition
        /// </value>
        return this._onShow ? this._onShow.get_json() : null;
    },
    set_onShow : function(value) {
        if (!this._onShow) {
            this._onShow = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onShow.initialize();
        }
        this._onShow.set_json(value);
        var animation = this._onShow.get_animation();
        if (animation) {
            animation.add_ended(this._onShowEndedHandler);
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnShow Animation's behavior
        /// </value>
        return this._onShow;
    },
    onShow : function() {
        /// <summary>
        /// Play the OnShow animation
        /// </summary>
        /// <returns />
        if (this._onShow) {
            if (this._onHide) {
                this._onHide.quit();
            }
            this._onShow.play();
        }
    },
    _onShowEnded : function() {
        /// <summary>
        /// Handler for the OnShow Animation's Ended event
        /// </summary>
        
        // Make sure the popup is where it belongs
        this.adjustPopupPosition();
        this.addBackgroundIFrame();
        
        this.raiseShown(Sys.EventArgs.Empty);
    },
    
    get_onHide : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHide Animation's JSON definition
        /// </value>
        return this._onHide ? this._onHide.get_json() : null;
    },
    set_onHide : function(value) {
        if (!this._onHide) {
            this._onHide = new AjaxControlToolkit.Animation.GenericAnimationBehavior(this.get_element());
            this._onHide.initialize();
        }
        this._onHide.set_json(value);
        var animation = this._onHide.get_animation();
        if (animation) {
            animation.add_ended(this._onHideEndedHandler);
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnHide Animation's behavior
        /// </value>
        return this._onHide;
    },
    onHide : function() {
        /// <summary>
        /// Play the OnHide animation
        /// </summary>
        /// <returns />
        if (this._onHide) {
            if (this._onShow) {
                this._onShow.quit();
            }
            this._onHide.play();
        }
    },
    _onHideEnded : function() {
        /// <summary>
        /// Handler for the OnHide Animation's Ended event
        /// </summary>
        
        this._hideCleanup();
    },
    
    get_parentElement : function() {
        /// <value type="Sys.UI.DomElement" domElement="true">
        /// Parent dom element.
        /// </value>
        
        if (!this._parentElement && this._parentElementID) {
            this.set_parentElement($get(this._parentElementID));
            Sys.Debug.assert(this._parentElement != null, String.format(AjaxControlToolkit.Resources.PopupExtender_NoParentElement, this._parentElementID));
        }        
        return this._parentElement;
    },
    set_parentElement : function(element) {
        this._parentElement = element;
        this.raisePropertyChanged('parentElement');
    },
    
    get_parentElementID : function() {
        /// <value type="String">
        /// Parent dom element.
        /// </value>
        
        if (this._parentElement) {
            return this._parentElement.id
        }
        return this._parentElementID;
    },
    set_parentElementID : function(elementID) {
        this._parentElementID = elementID;
        if (this.get_isInitialized()) {
            this.set_parentElement($get(elementID));
        }
    },
        
    get_positioningMode : function() {
        /// <value type="AjaxControlToolkit.PositioningMode">
        /// Positioning mode.
        /// </value>
        return this._positioningMode;
    },
    set_positioningMode : function(mode) {
        this._positioningMode = mode;
        this.raisePropertyChanged('positioningMode');
    },
    
    get_x : function() {
        /// <value type="Number">
        /// X coordinate.
        /// </value>
        return this._x;
    },
    set_x : function(value) {
        if (value != this._x) {
            this._x = value;
            
            // Reposition the popup if it's already showing
            if (this._visible) {
                this.setupPopup();
            }
            this.raisePropertyChanged('x');
        }
    },
    
    get_y : function() {
        /// <value type="Number">
        /// Y coordinate.
        /// </value>
        return this._y;
    },
    set_y : function(value) {
        if (value != this._y) {
            this._y = value;
            
            // Reposition the popup if it's already showing
            if (this._visible) {
                this.setupPopup();
            }
            this.raisePropertyChanged('y');
        }
    },
    
    get_visible : function() {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether or not the popup is currently visible
        /// </value>
        return this._visible;
    },
    
    add_showing : function(handler) {
        /// <summary>
        /// Add an event handler for the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('showing', handler);
    },
    remove_showing : function(handler) {
        /// <summary>
        /// Remove an event handler from the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('showing', handler);
    },
    raiseShowing : function(eventArgs) {
        /// <summary>
        /// Raise the showing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the showing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_shown : function(handler) {
        /// <summary>
        /// Add an event handler for the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('shown', handler);
    },
    remove_shown : function(handler) {
        /// <summary>
        /// Remove an event handler from the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('shown', handler);
    },
    raiseShown : function(eventArgs) {
        /// <summary>
        /// Raise the shown event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the shown event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('shown');
        if (handler) {
            handler(this, eventArgs);
        }
    },    
    
    add_hiding : function(handler) {
        /// <summary>
        /// Add an event handler for the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hiding', handler);
    },
    remove_hiding : function(handler) {
        /// <summary>
        /// Remove an event handler from the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hiding', handler);
    },
    raiseHiding : function(eventArgs) {
        /// <summary>
        /// Raise the hiding event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the hiding event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hidden : function(handler) {
        /// <summary>
        /// Add an event handler for the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden : function(handler) {
        /// <summary>
        /// Remove an event handler from the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hidden', handler);
    },
    raiseHidden : function(eventArgs) {
        /// <summary>
        /// Raise the hidden event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hidden event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hidden');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
AjaxControlToolkit.PopupBehavior.registerClass('AjaxControlToolkit.PopupBehavior', AjaxControlToolkit.BehaviorBase);
//AjaxControlToolkit.PopupBehavior.descriptor = {
//    properties: [   {name: 'parentElement', attributes: [ Sys.Attributes.Element, true ] },
//                    {name: 'positioningMode', type: AjaxControlToolkit.PositioningMode},
//                    {name: 'x', type: Number},
//                    {name: 'y', type: Number} ],
//    events: [   {name: 'show'},
//                {name: 'hide'} ]
//}

AjaxControlToolkit.PositioningMode = function() {
    /// <summary>
    /// Positioning mode describing how the popup should be positioned
    /// relative to its specified parent
    /// </summary>
    /// <field name="Absolute" type="Number" integer="true" />
    /// <field name="Center" type="Number" integer="true" />
    /// <field name="BottomLeft" type="Number" integer="true" />
    /// <field name="BottomRight" type="Number" integer="true" />
    /// <field name="TopLeft" type="Number" integer="true" />
    /// <field name="TopRight" type="Number" integer="true" />
    throw Error.invalidOperation();
}
AjaxControlToolkit.PositioningMode.prototype = {
    Absolute: 0,
    Center: 1,
    BottomLeft: 2,
    BottomRight: 3,
    TopLeft: 4,
    TopRight: 5
}
AjaxControlToolkit.PositioningMode.registerEnum('AjaxControlToolkit.PositioningMode');

//END AjaxControlToolkit.PopupExtender.PopupBehavior.js
//START AjaxControlToolkit.AutoComplete.AutoCompleteBehavior.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />


Type.registerNamespace('AjaxControlToolkit');

AjaxControlToolkit.AutoCompleteBehavior = function(element) {
    /// <summary>
    /// This behavior can be attached to a textbox to enable auto-complete/auto-suggest scenarios.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false">
    /// DOM Element the behavior is associated with
    /// </param>
    /// <returns />
    AjaxControlToolkit.AutoCompleteBehavior.initializeBase(this, [element]);
    
    // Path to the web service, or null if a page method
    this._servicePath = null;
    
    // Name of the web method
    this._serviceMethod = null;
    
    // User/page specific context provided to the web method
    this._contextKey = null;
    
    // Whether or not the the user/page specific context should be used
    this._useContextKey = false;
    this._minimumPrefixLength = 3;
    this._completionSetCount = 10;
    this._completionInterval = 1000;        
    this._completionListElementID = null;
    this._completionListElement = null;
    this._textColor = 'windowtext';
    this._textBackground = 'window';
    this._popupBehavior = null;
    this._popupBehaviorHiddenHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
    this._timer = null;
    this._cache = null;
    this._currentPrefix = null;
    this._selectIndex = -1;
    this._focusHandler = null;
    this._blurHandler = null;
    this._bodyClickHandler = null;
    this._completionListBlurHandler = null;        
    this._keyDownHandler = null;
    this._mouseDownHandler = null;
    this._mouseUpHandler = null;
    this._mouseOverHandler = null;
    this._tickHandler = null;
    this._enableCaching = true;
    this._flyoutHasFocus = false;
    this._textBoxHasFocus = false;
    this._completionListCssClass = null;
    this._completionListItemCssClass = null;
    this._highlightedItemCssClass = null;
    this._delimiterCharacters = null;
    this._firstRowSelected = false;
    
}
AjaxControlToolkit.AutoCompleteBehavior.prototype = {
    initialize: function() {
        /// <summary>
        /// Initializes the autocomplete behavior.
        /// </summary>
        /// <returns />
        AjaxControlToolkit.AutoCompleteBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();
        
        this._popupBehaviorHiddenHandler = Function.createDelegate(this, this._popupHidden);
        this._tickHandler = Function.createDelegate(this, this._onTimerTick);
        this._focusHandler = Function.createDelegate(this, this._onGotFocus);
        this._blurHandler = Function.createDelegate(this, this._onLostFocus);
        this._keyDownHandler = Function.createDelegate(this, this._onKeyDown);
        this._mouseDownHandler = Function.createDelegate(this, this._onListMouseDown);
        this._mouseUpHandler = Function.createDelegate(this, this._onListMouseUp);
        this._mouseOverHandler = Function.createDelegate(this, this._onListMouseOver);
        this._completionListBlurHandler = Function.createDelegate(this, this._onCompletionListBlur);
        this._bodyClickHandler = Function.createDelegate(this, this._onCompletionListBlur);
        
        
        this._timer = new Sys.Timer();
        this.initializeTimer(this._timer);
        
        var element = this.get_element();
        this.initializeTextBox(element);
        
        if(this._completionListElementID !== null)
            this._completionListElement = $get(this._completionListElementID);
        if (this._completionListElement == null ) {
            this._completionListElement = document.createElement('ul');
            this._completionListElement.id = this.get_id() + '_completionListElem';

            // Safari styles the element incorrectly if it's added to the desired location
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                document.body.appendChild(this._completionListElement);
            } else {
                element.parentNode.insertBefore(this._completionListElement, element.nextSibling);
            }
        }
        this.initializeCompletionList(this._completionListElement);
        
        this._popupBehavior = $create(AjaxControlToolkit.PopupBehavior, 
                { 'id':this.get_id()+'PopupBehavior', 'parentElement':element, "positioningMode": AjaxControlToolkit.PositioningMode.BottomLeft }, null, null, this._completionListElement);
        this._popupBehavior.add_hidden(this._popupBehaviorHiddenHandler);
        
        // Create the animations (if they were set before initialize was called)
        if (this._onShowJson) {
            this._popupBehavior.set_onShow(this._onShowJson);
        }
        if (this._onHideJson) {
            this._popupBehavior.set_onHide(this._onHideJson);
        }
    },
    
    dispose: function() {
        /// <summary>
        /// Disposes the autocomplete behavior
        /// </summary>
        /// <returns />
       
        this._onShowJson = null;
        this._onHideJson = null;
        if (this._popupBehavior) {
            if (this._popupBehaviorHiddenHandler) {
                this._popupBehavior.remove_hidden(this._popupBehaviorHiddenHandler);
            }
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        if (this._timer) {        
            this._timer.dispose();
            this._timer = null;
        }

        var element = this.get_element();
        if (element) {
            $removeHandler(element, "focus", this._focusHandler);
            $removeHandler(element, "blur", this._blurHandler);
            $removeHandler(element, "keydown", this._keyDownHandler);
            $removeHandler(this._completionListElement, 'blur', this._completionListBlurHandler);
            $removeHandler(this._completionListElement, 'mousedown', this._mouseDownHandler);
            $removeHandler(this._completionListElement, 'mouseup', this._mouseUpHandler);
            $removeHandler(this._completionListElement, 'mouseover', this._mouseOverHandler);
        }
        if (this._bodyClickHandler) {
            $removeHandler(document.body, 'click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }
        
        this._popupBehaviorHiddenHandler = null;
        this._tickHandler = null;
        this._focusHandler = null;
        this._blurHandler = null;
        this._keyDownHandler = null;
        this._completionListBlurHandler = null;
        this._mouseDownHandler = null;
        this._mouseUpHandler = null;
        this._mouseOverHandler = null;
        
        AjaxControlToolkit.AutoCompleteBehavior.callBaseMethod(this, 'dispose');
    },
    
    initializeTimer: function(timer) {
        /// <summary>
        /// Initializes the timer
        /// </summary>
        /// <param name="timer" type="Sys.UI.Timer" DomElement="false" mayBeNull="false" />
        /// <returns />
        timer.set_interval(this._completionInterval);
        timer.add_tick(this._tickHandler);
    },
    
    initializeTextBox: function(element) {
        /// <summary>
        /// Initializes the textbox
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false" />
        /// <returns />    
        element.autocomplete = "off";
        $addHandler(element, "focus", this._focusHandler);        
        $addHandler(element, "blur", this._blurHandler);
        $addHandler(element, "keydown", this._keyDownHandler);
    },
    
    initializeCompletionList: function(element) {
        /// <summary>
        /// Initializes the autocomplete list element
        /// </summary>
        /// <param name="element" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false" />
        /// <returns />        
        
        
        if(this._completionListCssClass) {
            Sys.UI.DomElement.addCssClass(element, this._completionListCssClass);
        } else {
            var completionListStyle = element.style;
            completionListStyle.textAlign = 'left';
            completionListStyle.visibility = 'hidden';
            completionListStyle.cursor = 'default';
            completionListStyle.listStyle = 'none';
            completionListStyle.padding = '0px';
            completionListStyle.margin = '0px! important';
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                completionListStyle.border = 'solid 1px gray';    
                completionListStyle.backgroundColor = 'white';
                completionListStyle.color = 'black';                        
            } else {
                completionListStyle.border = 'solid 1px buttonshadow';            
                completionListStyle.backgroundColor = this._textBackground;
                completionListStyle.color = this._textColor;                
            }
        }
        $addHandler(element, "mousedown", this._mouseDownHandler);
        $addHandler(element, "mouseup", this._mouseUpHandler);
        $addHandler(element, "mouseover", this._mouseOverHandler);
        $addHandler(element, "blur", this._completionListBlurHandler);   
        $addHandler(document.body, 'click', this._bodyClickHandler);
    },
    
    _currentCompletionWord: function() {
        var element = this.get_element();
        var elementValue = element.value;
        var word = elementValue;
        
        if (this.get_isMultiWord()) {
            var startIndex = this._getCurrentWordStartIndex();
            var endIndex = this._getCurrentWordEndIndex(startIndex);
            
            if (endIndex <= startIndex) {
                word = elementValue.substring(startIndex);
            } else {
                word = elementValue.substring(startIndex, endIndex);
            }
        }
        
        return word;
    },
    
    _getCursorIndex: function() {
        return this.get_element().selectionStart;
    },
    
    _getCurrentWordStartIndex: function() {
        var element = this.get_element();
        var elementText = element.value.substring(0,this._getCursorIndex());
        
        var index = 0;
        var lastIndex = -1;
        
        for (var i = 0; i < this._delimiterCharacters.length; ++i) {
            var curIndex = elementText.lastIndexOf(this._delimiterCharacters.charAt(i));
            if (curIndex > lastIndex) {
                lastIndex = curIndex;
            }
        }    
        
        index = lastIndex;
        if (index >= this._getCursorIndex()) {
            index = 0;
        }
        
        return index < 0 ? 0 : index + 1;    
    },
    
    _getCurrentWordEndIndex: function(wordStartIndex) {
        var element = this.get_element();
        var elementText = element.value.substring(wordStartIndex);
        var index = 0;
        
        for (var i = 0; i < this._delimiterCharacters.length; ++i) {
            var curIndex = elementText.indexOf(this._delimiterCharacters.charAt(i));
            if (curIndex > 0 && (curIndex < index || index == 0)) {
                index = curIndex;
            }
        }
               
        return index <= 0 ? element.value.length : index + wordStartIndex;
    },
    
    get_isMultiWord : function() {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether the behavior is currently in multi-word mode
        /// </value>
        return (this._delimiterCharacters != null) && (this._delimiterCharacters != '');
    },
    
    _getTextWithInsertedWord: function(wordToInsert) {
        var text = wordToInsert;
        var replaceIndex = 0;
        var element = this.get_element();
        var originalText = element.value;
        
        if (this.get_isMultiWord()) {
            var startIndex = this._getCurrentWordStartIndex();
            var endIndex = this._getCurrentWordEndIndex(startIndex);
            var prefix = '';
            var suffix = '';
            
            if (startIndex > 0) {
                prefix = originalText.substring(0, startIndex);
            }
            if (endIndex > startIndex) {
                suffix = originalText.substring(endIndex);
            }
            
            text = prefix + wordToInsert + suffix;
        }
        
        return text;
    },
    
    _hideCompletionList: function() {
        /// <summary>
        /// Hides the autocomplete flyout list
        /// </summary>
        /// <returns />
        
        var eventArgs = new Sys.CancelEventArgs();
        this.raiseHiding(eventArgs);
        if (eventArgs.get_cancel()) {
            return;
        }
        
        // Actually hide the popup
        this.hidePopup();
    },
    
    showPopup : function() {
        /// <summary>
        /// Show the completion list popup
        /// </summary>
        /// <remarks>
        /// If you cancel the showing event, you should still call
        /// showPopup to ensure consistency of the internal state
        /// </remarks>
        this._popupBehavior.show();
        this.raiseShown(Sys.EventArgs.Empty);
    },
    
    hidePopup : function() {
        /// <summary>
        /// Hide the completion list popup
        /// </summary>
        /// <remarks>
        /// If you cancel the hiding event, you should still
        /// call hidePopup to ensure consistency of the internal
        /// state
        /// </remarks>

        if (this._popupBehavior) {
            this._popupBehavior.hide();
        } else {
            this._popupHidden();
        }
    },
    
    _popupHidden : function() {
        /// <summary>
        /// Clean up the completion list popup after it has been hidden
        /// </summary>
    
        this._completionListElement.innerHTML = '';
        this._selectIndex = -1;
        this._flyoutHasFocus = false;
        
        this.raiseHidden(Sys.EventArgs.Empty);
    },
    
    _highlightItem: function(item) {
        /// <summary>
        /// Highlights the specified item
        /// </summary>
        /// <param name="item" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false" />
        /// <returns />
        
        var children = this._completionListElement.childNodes;

        // Unselect any previously highlighted item
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child._highlighted) {
                if (this._completionListItemCssClass) {
                    Sys.UI.DomElement.removeCssClass(child, this._highlightedItemCssClass);
                    Sys.UI.DomElement.addCssClass(child, this._completionListItemCssClass);
                } else {
                    if (Sys.Browser.agent === Sys.Browser.Safari) {
                        child.style.backgroundColor = 'white';
                        child.style.color = 'black';
                    } else {
                        child.style.backgroundColor = this._textBackground;
                        child.style.color = this._textColor;
                    }
                }
                this.raiseItemOut(new AjaxControlToolkit.AutoCompleteItemEventArgs(child, child.firstChild.nodeValue, child._value));
            }
        }
        
        // Highlight the new item
        if(this._highlightedItemCssClass) {
            Sys.UI.DomElement.removeCssClass(item, this._completionListItemCssClass);
            Sys.UI.DomElement.addCssClass(item, this._highlightedItemCssClass);
        } else {
            if (Sys.Browser.agent === Sys.Browser.Safari) {
                item.style.backgroundColor = 'lemonchiffon';
            } else {
                item.style.backgroundColor = 'highlight';
                item.style.color = 'highlighttext';
            }
            
        }
        item._highlighted = true;
        this.raiseItemOver(new AjaxControlToolkit.AutoCompleteItemEventArgs(item, item.firstChild.nodeValue, item._value));
    },

    /// <summary>
    /// Handler for the blur event on the autocomplete flyout.
    /// </summary>
    /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
    /// <returns />    
    _onCompletionListBlur: function(ev) {
        this._hideCompletionList();
    },
    
    _onListMouseDown: function(ev) {
        /// <summary>
        /// Handler for the mousedown event on the autocomplete flyout.
        /// </summary>
        /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
        /// <returns />     
        if (ev.target !== this._completionListElement) {
            this._setText(ev.target);
            this._flyoutHasFocus = false;
        } else { // focus is still on the flyout and we do not want to hide it
            this._flyoutHasFocus = true;
        }
    },
    
    _onListMouseUp: function(ev) {
        /// <summary>
        /// Handler for the mouseup event on the autocomplete flyout.
        /// </summary>
        /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
        /// <returns />      
        this.get_element().focus();
    },
    
    _onListMouseOver: function(ev) {
        /// <summary>
        /// Handler for the mouseover event on the autocomplete flyout.
        /// </summary>
        /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
        /// <returns />      
        var item = ev.target;
        if(item !== this._completionListElement) {
            var children = this._completionListElement.childNodes;
            // make sure the selected index is updated
            for (var i = 0; i < children.length; ++i) {
                if (item === children[i]) {
                    this._highlightItem(item);
                    this._selectIndex = i;
                    break;
                }  
            }
        }
    },

    _onGotFocus: function(ev) {
        /// <summary>
        /// Handler for textbox focus event.
        /// </summary>
        /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
        /// <returns />      
        this._textBoxHasFocus = true;
        if (this._flyoutHasFocus) {
            // hide the flyout now that the focus is back on the textbox
            this._hideCompletionList();          
        }
        this._timer.set_enabled(true);
    },
    
    _onKeyDown: function(ev) {
        /// <summary>
        /// Handler for the textbox keydown event.
        /// </summary>
        /// <param name="ev" type="Sys.UI.DomEvent" DomElement="false" mayBeNull="false" />
        /// <returns />      
        var k = ev.keyCode ? ev.keyCode : ev.rawEvent.keyCode;
        if (k === Sys.UI.Key.esc) {
            this._hideCompletionList();
            ev.preventDefault();
        }
        else if (k === Sys.UI.Key.up) {
            if (this._selectIndex > 0) {
                this._selectIndex--;
                this._handleScroll(this._completionListElement.childNodes[this._selectIndex], this._selectIndex);
                this._highlightItem(this._completionListElement.childNodes[this._selectIndex]);
                ev.stopPropagation();     
                ev.preventDefault();
            }
        }
        else if (k === Sys.UI.Key.down) {
            if (this._selectIndex < (this._completionListElement.childNodes.length - 1)) {
                this._selectIndex++;                        
                this._handleScroll(this._completionListElement.childNodes[this._selectIndex], this._selectIndex);
                this._highlightItem(this._completionListElement.childNodes[this._selectIndex]);              
                ev.stopPropagation();                
                ev.preventDefault();
            }
        }
        else if (k === Sys.UI.Key.enter) {
            if (this._selectIndex !== -1) {
                this._setText(this._completionListElement.childNodes[this._selectIndex]);
                ev.preventDefault();
            } else {
                // close the popup
                this.hidePopup();
            }
        }
        else if (k === Sys.UI.Key.tab) {
            if (this._selectIndex !== -1) {
                this._setText(this._completionListElement.childNodes[this._selectIndex]);
            }
        }
        else {
            this._timer.set_enabled(true);
        }
    },
    
    _handleScroll : function(element, index) {
        /// <summary>
        /// Method to determine if an item is in view or not
        /// </summary>
        /// <returns />
        /// <param name="element" type="Sys.UI.DomElement" DomElement="true" mayBeNull="false" />
        /// <param name="index" type="Number" DomElement="false" mayBeNull="true" />        
        var flyout = this._completionListElement;
        var elemBounds = $common.getBounds(element);
        var numItems = this._completionListElement.childNodes.length;
        if (((elemBounds.height * index) - (flyout.clientHeight + flyout.scrollTop)) >= 0) {
            // you need to scroll down
            flyout.scrollTop += (((elemBounds.height * index) - (flyout.clientHeight + flyout.scrollTop)) + elemBounds.height);
        }
        if (((elemBounds.height * (numItems - (index + 1))) - (flyout.scrollHeight - flyout.scrollTop)) >= 0) {
            // you need to scroll up
            flyout.scrollTop -= (((elemBounds.height * (numItems - (index + 1))) - (flyout.scrollHeight - flyout.scrollTop)) + elemBounds.height); 
        }  
        
        if (flyout.scrollTop % elemBounds.height !== 0) { 
            if (((elemBounds.height * (index + 1)) - (flyout.clientHeight + flyout.scrollTop)) >= 0) { 
                // an element is partially displayed at the bottom
                flyout.scrollTop -= (flyout.scrollTop % elemBounds.height);       
            } else { // an element is partially displayed on the top 
                flyout.scrollTop += (elemBounds.height - (flyout.scrollTop % elemBounds.height));
            }
        }  
     
    },
    
    _handleFlyoutFocus : function() {
        /// <summary>
        /// Method to handle flyout focus if textbox loses focus.
        /// </summary>
        /// <returns />   
        if(!this._textBoxHasFocus) { 
            if (!this._flyoutHasFocus) { 
                // the textbox lost focus and the flyout does not have it
                this._hideCompletionList();
            } else {
                // keep the flyout around otherwise
            }
        }
    },     
    
    _onLostFocus: function() {
        /// <summary>
        /// Handler textbox blur event.
        /// </summary>
        /// <returns />      
        this._textBoxHasFocus = false;   
        this._timer.set_enabled(false);   
        /* the rest of the onblur handling will be done in
        this method after a minor delay to ensure we do not close the flyout 
        if a user clicks on its scroll bars for example */  
        window.setTimeout(Function.createDelegate(this, this._handleFlyoutFocus), 500);
    },  
    
    _onMethodComplete: function(result, context) {
        /// <summary>
        /// Handler invoked when the webservice call is completed.
        /// </summary>
        /// <param name="result" type="Object" DomElement="false" mayBeNull="true" />
        /// <param name="context" type="String" DomElement="false" mayBeNull="true" />        
        /// <returns />     
        this._update(context, result, /* cacheResults */ true);
    },
    
    _onMethodFailed: function(err, response, context) {
        /// <summary>
        /// Handler invoked when the webservice call fails, currently a noop
        /// </summary>
        /// <param name="err" type="Object" DomElement="false" mayBeNull="true" />        
        /// <param name="result" type="Object" DomElement="false" mayBeNull="true" />
        /// <param name="context" type="String" DomElement="false" mayBeNull="true" />
        /// <returns />     
        
        // no op
    },
    
    _onTimerTick: function(sender, eventArgs) {
        /// <summary>
        /// Handler invoked when a timer tick occurs
        /// </summary>
        /// <param name="sender" type="Object" mayBeNull="true"/>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="true" />        
        /// <returns />  
        
        if (this._servicePath && this._serviceMethod) {
            var text = this._currentCompletionWord();
            
            if (text.trim().length < this._minimumPrefixLength) {
                this._currentPrefix = null;
                this._update('', null, /* cacheResults */ false);
                return;
            }
            // there is new content in the textbox or the textbox is empty but the min prefix length is 0
           if ((this._currentPrefix !== text) || ((text == "") && (this._minimumPrefixLength == 0))) {
                this._currentPrefix = text;
                if ((text != "") && this._cache && this._cache[text]) {
                    this._update(text, this._cache[text], /* cacheResults */ false);
                    return;
                }
                // Raise the populating event and optionally cancel the web service invocation
                var eventArgs = new Sys.CancelEventArgs();
                this.raisePopulating(eventArgs);
                if (eventArgs.get_cancel()) {
                    return;
                }
                
                // Create the service parameters and optionally add the context parameter
                // (thereby determining which method signature we're expecting...)
                var params = { prefixText : this._currentPrefix, count: this._completionSetCount };
                if (this._useContextKey) {
                    params.contextKey = this._contextKey;
                }
                
                // Invoke the web service
                Sys.Net.WebServiceProxy.invoke(this.get_servicePath(), this.get_serviceMethod(), false, params,
                                            Function.createDelegate(this, this._onMethodComplete),
                                            Function.createDelegate(this, this._onMethodFailed),
                                            text);
                $common.updateFormToRefreshATDeviceBuffer();
            }
        }
    },
    
    _setText: function(item) {
        /// <summary>
        /// Method to set the selected autocomplete option on the textbox
        /// </summary>
        /// <param name="item" type="Sys.UI.DomElement" DomElement="true" mayBeNull="true">
        /// Item to select
        /// </param>
        /// <returns />
        
        var text = (item && item.firstChild) ? item.firstChild.nodeValue : null;
       
        this._timer.set_enabled(false);

        var element = this.get_element();
        var control = element.control;
        if (control && control.set_text) {
            control.set_text(text);
            $common.tryFireEvent(control, "change");
        }
        else {
            element.value = text;
            $common.tryFireEvent(element, "change");
        }
        this.raiseItemSelected(new AjaxControlToolkit.AutoCompleteItemEventArgs(item, text, item ? item._value : null));

        this._currentPrefix = this._currentCompletionWord();
        this._hideCompletionList();
    },
    
    _update: function(prefixText, completionItems, cacheResults) {
        /// <summary>
        /// Method to update the status of the autocomplete behavior
        /// </summary>
        /// <param name="prefixText" type="String" DomElement="false" mayBeNull="true" />
        /// <param name="completionItems" type="Object" DomElement="false" mayBeNull="true" />
        /// <param name="cacheResults" type="Object" DomElement="false" mayBeNull="true" />
        /// <returns />       
        if (cacheResults && this.get_enableCaching()) {
            if (!this._cache) {
                this._cache = {};
            }
            this._cache[prefixText] = completionItems;
        }
        
        // If the target control loses focus or 
        // if the value in textbox has changed before the webservice returned
        // completion items we don't need to show popup 
        if ((!this._textBoxHasFocus) || (prefixText != this._currentCompletionWord())) {
            this._hideCompletionList();
            return;
        }  
        
        if (completionItems && completionItems.length) {
            this._completionListElement.innerHTML = '';
            this._selectIndex = -1;
            var _firstChild = null;
            var text = null;
            var value = null;
            
            for (var i = 0; i < completionItems.length; i++) {
                // Create the item                
                var itemElement = null;
                if (this._completionListElementID) { 
                    // the completion element has been created by the user and li won't necessarily work
                    itemElement = document.createElement('div');
                } else {
                    itemElement = document.createElement('li');
                }
                
                // set the first child if it is null
                if( _firstChild == null ){
                    _firstChild = itemElement;
                }
                
                // Get the text/value for the item
                try {
                    var pair = Sys.Serialization.JavaScriptSerializer.deserialize('(' + completionItems[i] + ')');
                    if (pair && pair.First) {
                        // Use the text and value pair returned from the web service
                        text = pair.First;
                        value = pair.Second;
                    } else {
                        // If the web service only returned a regular string, use it for
                        // both the text and the value
                        text = pair;
                        value = pair; 
                    } 
                } catch (ex) {
                    text = completionItems[i];
                    value = completionItems[i];
                }


                // Set the text/value for the item
                itemElement.appendChild(document.createTextNode(this._getTextWithInsertedWord(text)));
                itemElement._value = value;
                itemElement.__item = '';
                
                if (this._completionListItemCssClass) {
                    Sys.UI.DomElement.addCssClass(itemElement, this._completionListItemCssClass);
                } else {
                    var itemElementStyle = itemElement.style;
                    itemElementStyle.padding = '0px';
                    itemElementStyle.textAlign = 'left';
                    itemElementStyle.textOverflow = 'ellipsis';
                    // workaround for safari since normal colors do not
                    // show well there.
                    if (Sys.Browser.agent === Sys.Browser.Safari) {
                        itemElementStyle.backgroundColor = 'white';
                        itemElementStyle.color = 'black';
                    } else {
                        itemElementStyle.backgroundColor = this._textBackground;
                        itemElementStyle.color = this._textColor;
                    }
                }
                this._completionListElement.appendChild(itemElement);
            }
            var elementBounds = $common.getBounds(this.get_element());        
            this._completionListElement.style.width = Math.max(1, elementBounds.width - 2) + 'px';
            this._completionListElement.scrollTop = 0;
            
            this.raisePopulated(Sys.EventArgs.Empty);
            
            var eventArgs = new Sys.CancelEventArgs();
            this.raiseShowing(eventArgs);
            if (!eventArgs.get_cancel()) {
                this.showPopup();
                // Check if the first Row is to be selected by default and if yes highlight it and updated selectIndex.
                if (this._firstRowSelected && (_firstChild != null)) {
                    this._highlightItem( _firstChild );
                    this._selectIndex = 0;
                }
            }            
        } else {
            this._hideCompletionList();
        }
    },
    
    get_onShow : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnShow Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnShow Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },
    onShow : function() {
        /// <summary>
        /// Play the OnShow animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },
        
    get_onHide : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHide Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnHide Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },
    onHide : function() {
        /// <summary>
        /// Play the OnHide animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },
    
    get_completionInterval: function() {
        /// <value type="Number" integer="true" maybeNull="true">
        /// Auto completion timer interval in milliseconds.
        /// </value>
        return this._completionInterval;
    },
    set_completionInterval: function(value) {
        if (this._completionInterval != value) {
            this._completionInterval = value;
            this.raisePropertyChanged('completionInterval');
        }
    },
    
    get_completionList: function() {
        /// <value type="Sys.UI.DomElement" domElement="true" maybeNull="true">
        /// List dom element.
        /// </value>
        return this._completionListElement;
    },
    set_completionList: function(value) {
        if (this._completionListElement != value) {
            this._completionListElement = value;
            this.raisePropertyChanged('completionList');
        }
    },
    
    get_completionSetCount: function() {
        /// <value type="Number" integer="true" maybeNull="true">
        /// Maximum completion set size.
        /// </value>
        return this._completionSetCount;
    },
    set_completionSetCount: function(value) {
        if (this._completionSetCount != value) {
            this._completionSetCount = value;
            this.raisePropertyChanged('completionSetCount');
        }
    },
    
    get_minimumPrefixLength: function() {
        /// <value type="Number" integer="true" maybeNull="true">
        /// Minimum text prefix length required to call the webservice.
        /// </value>
        return this._minimumPrefixLength;
    },
    set_minimumPrefixLength: function(value) {
        if (this._minimumPrefixLength != value) {
            this._minimumPrefixLength = value;
            this.raisePropertyChanged('minimumPrefixLength');
        }
    },
    
    get_serviceMethod: function() {
        /// <value type="String" maybeNull="false">
        /// Web service method.
        /// </value>
        return this._serviceMethod;
    },
    set_serviceMethod: function(value) {
        if (this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('serviceMethod');
        }
    },
    
    get_servicePath: function() {
        /// <value type="String" maybeNull="true">
        /// Web service url.
        /// </value>
        return this._servicePath;
    },
    set_servicePath: function(value) {
        if (this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('servicePath');
        }
    },
    
    get_contextKey : function() {
        /// <value type="String" mayBeNull="true">
        /// User/page specific context provided to an optional overload of the
        /// web method described by ServiceMethod/ServicePath.  If the context
        /// key is used, it should have the same signature with an additional
        /// parameter named contextKey of type string.
        /// </value>
        return this._contextKey;
    },
    set_contextKey : function(value) {
        if (this._contextKey != value) {
            this._contextKey = value;
            this.set_useContextKey(true);
            this.raisePropertyChanged('contextKey');
        }
    },
    
    get_useContextKey : function() {
        /// <value type="Boolean">
        /// Whether or not the ContextKey property should be used.  This will be
        /// automatically enabled if the ContextKey property is ever set
        /// (on either the client or the server).  If the context key is used,
        /// it should have the same signature with an additional parameter
        /// named contextKey of type string.
        /// </value>
        return this._useContextKey;
    },
    set_useContextKey : function(value) {
        if (this._useContextKey != value) {
            this._useContextKey = value;
            this.raisePropertyChanged('useContextKey');
        }
    },
    
    get_enableCaching: function() {
        /// <value type="Boolean" maybeNull="true">
        /// Get or sets whether suggestions retrieved from the webservice
        /// should be cached.
        /// </value>
        return this._enableCaching;
    },
    set_enableCaching: function(value) {
        if (this._enableCaching != value) {
            this._enableCaching = value;
            this.raisePropertyChanged('enableCaching');
        }
    },
    
    get_completionListElementID: function() {
        /// <value type="String" maybeNull="true">
        /// ID of the completion div element.
        /// </value>
        return this._completionListElementID;
    },
    set_completionListElementID: function(value) {
        if (this._completionListElementID != value) {
            this._completionListElementID = value;
            this.raisePropertyChanged('completionListElementID');
        }
    },  
    
    get_completionListCssClass : function() {
        /// <value type="String" maybeNull="true">
        /// Css class name that will be used to style the completion list element.
        /// </value>
        return this._completionListCssClass;
    },
    set_completionListCssClass : function(value) {
        if (this._completionListCssClass != value) {
            this._completionListCssClass = value;    
            this.raisePropertyChanged('completionListCssClass');
        }
    },   
    
    get_completionListItemCssClass : function() {
        /// <value type="String" maybeNull="true">
        /// Css class name that will be used to style an item in the completion list.
        /// </value>
        return this._completionListItemCssClass;
    },
    set_completionListItemCssClass : function(value) {
        if (this._completionListItemCssClass != value) {
            this._completionListItemCssClass = value;    
            this.raisePropertyChanged('completionListItemCssClass');
        }
    },
    
    get_highlightedItemCssClass : function() {
        /// <value type="String" maybeNull="true">
        /// Css class name that will be used to style a highlighted item in the list.
        /// </value>
        return this._highlightedItemCssClass;
    },
    set_highlightedItemCssClass : function(value) {
        if(this._highlightedItemCssClass != value) {
            this._highlightedItemCssClass = value;
            this.raisePropertyChanged('highlightedItemCssClass');
        }
    },
    
    get_delimiterCharacters: function() {
        /// <value type="String">
        /// Gets or sets the character(s) used to seperate words for autocomplete.
        /// </value>
        return this._delimiterCharacters;
    },
    set_delimiterCharacters: function(value) {
        if (this._delimiterCharacters != value) {
            this._delimiterCharacters = value;
            this.raisePropertyChanged('delimiterCharacters');
        }
    },
    
    get_firstRowSelected:function() {
        /// <value type="Boolean" maybeNull="true">
        /// Flag to determine if the first option in the flyout is selected or not. 
        /// </value>
        return this._firstRowSelected;
    },
    set_firstRowSelected:function(value) {
        if(this._firstRowSelected != value) {
            this._firstRowSelected = value;
            this.raisePropertyChanged('firstRowSelected');
        }
    },
    
    add_populating : function(handler) {
        /// <summary>
        /// Add an event handler for the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populating', handler);
    },
    remove_populating : function(handler) {
        /// <summary>
        /// Remove an event handler from the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating : function(eventArgs) {
        /// <summary>
        /// Raise the populating event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the populating event
        /// </param>
        /// <returns />
        /// <remarks>
        /// The populating event can be used to provide custom data to AutoComplete
        /// instead of using a web service.  Just cancel the event (using the
        /// CancelEventArgs) and pass your own data to the _update method.
        /// </remarks>
        
        var handler = this.get_events().getHandler('populating');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_populated : function(handler) {
        /// <summary>
        /// Add an event handler for the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populated', handler);
    },
    remove_populated : function(handler) {
        /// <summary>
        /// Remove an event handler from the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populated', handler);
    },
    raisePopulated : function(eventArgs) {
        /// <summary>
        /// Raise the populated event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the populated event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('populated');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_showing : function(handler) {
        /// <summary>
        /// Add an event handler for the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('showing', handler);
    },
    remove_showing : function(handler) {
        /// <summary>
        /// Remove an event handler from the showing event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('showing', handler);
    },
    raiseShowing : function(eventArgs) {
        /// <summary>
        /// Raise the showing event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the showing event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('showing');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_shown : function(handler) {
        /// <summary>
        /// Add an event handler for the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('shown', handler);
    },
    remove_shown : function(handler) {
        /// <summary>
        /// Remove an event handler from the shown event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('shown', handler);
    },
    raiseShown : function(eventArgs) {
        /// <summary>
        /// Raise the shown event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the shown event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('shown');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hiding : function(handler) {
        /// <summary>
        /// Add an event handler for the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hiding', handler);
    },
    remove_hiding : function(handler) {
        /// <summary>
        /// Remove an event handler from the hiding event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hiding', handler);
    },
    raiseHiding : function(eventArgs) {
        /// <summary>
        /// Raise the hiding event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the hiding event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hiding');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_hidden : function(handler) {
        /// <summary>
        /// Add an event handler for the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('hidden', handler);
    },
    remove_hidden : function(handler) {
        /// <summary>
        /// Remove an event handler from the hidden event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('hidden', handler);
    },
    raiseHidden : function(eventArgs) {
        /// <summary>
        /// Raise the hidden event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the hidden event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('hidden');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_itemSelected : function(handler) {
        /// <summary>
        /// Add an event handler for the itemSelected event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('itemSelected', handler);
    },
    remove_itemSelected : function(handler) {
        /// <summary>
        /// Remove an event handler from the itemSelected event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('itemSelected', handler);
    },
    raiseItemSelected : function(eventArgs) {
        /// <summary>
        /// Raise the itemSelected event
        /// </summary>
        /// <param name="eventArgs" type="AjaxControlToolkit.AutoCompleteItemEventArgs" mayBeNull="false">
        /// Event arguments for the itemSelected event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('itemSelected');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_itemOver : function(handler) {
        /// <summary>
        /// Add an event handler for the itemOver event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('itemOver', handler);
    },
    remove_itemOver : function(handler) {
        /// <summary>
        /// Remove an event handler from the itemOver event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('itemOver', handler);
    },
    raiseItemOver : function(eventArgs) {
        /// <summary>
        /// Raise the itemOver event
        /// </summary>
        /// <param name="eventArgs" type="AjaxControlToolkit.AutoCompleteItemEventArgs" mayBeNull="false">
        /// Event arguments for the itemOver event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('itemOver');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_itemOut : function(handler) {
        /// <summary>
        /// Add an event handler for the itemOut event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('itemOut', handler);
    },
    remove_itemOut : function(handler) {
        /// <summary>
        /// Remove an event handler from the itemOut event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('itemOut', handler);
    },
    raiseItemOut : function(eventArgs) {
        /// <summary>
        /// Raise the itemOut event
        /// </summary>
        /// <param name="eventArgs" type="AjaxControlToolkit.AutoCompleteItemEventArgs" mayBeNull="false">
        /// Event arguments for the itemOut event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('itemOut');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
AjaxControlToolkit.AutoCompleteBehavior.registerClass('AjaxControlToolkit.AutoCompleteBehavior', AjaxControlToolkit.BehaviorBase);
AjaxControlToolkit.AutoCompleteBehavior.descriptor = {
    properties: [   {name: 'completionInterval', type: Number},
                    {name: 'completionList', isDomElement: true},
                    {name: 'completionListElementID', type: String},
                    {name: 'completionSetCount', type: Number},
                    {name: 'minimumPrefixLength', type: Number},
                    {name: 'serviceMethod', type: String},
                    {name: 'servicePath', type: String},
                    {name: 'enableCaching', type: Boolean} ]
}


AjaxControlToolkit.AutoCompleteItemEventArgs = function(item, text, value) {
    /// <summary>
    /// Event arguments used when the itemSelected event is raised
    /// </summary>
    /// <param name="item" type="Sys.UI.DomElement" DomElement="true" mayBeNull="true">
    /// Item
    /// </param>
    /// <param name="text" type="String" mayBeNull="true">
    /// Text of the item
    /// </param>
    /// <param name="value" type="String" mayBeNull="true" optional="true">
    /// Value of the item different from text if specifically returned by the webservice
    /// as autocomplete json text/value item(using AutoComplete.CreateAutoCompleteItem); otherwise same as text.
    /// </param>
    AjaxControlToolkit.AutoCompleteItemEventArgs.initializeBase(this);
    
    this._item = item;
    this._text = text;
    this._value = (value !== undefined) ? value : null;
}
AjaxControlToolkit.AutoCompleteItemEventArgs.prototype = {
    get_item : function() {
        /// <value type="Sys.UI.DomElement" DomElement="true" mayBeNull="true">
        /// Item
        /// </value>
        return this._item;
    },
    set_item : function(value) {
        this._item = value;
    },
    
    get_text : function() {
        /// <value type="String" maybeNull="true">
        /// Text of the item
        /// </value>
        return this._text;
    },
    set_text : function(value) {
        this._text = value;
    },
    
    get_value : function() {
        /// <value type="String" maybeNull="true">
        /// Value of the item different from text if specifically returned by the webservice
        /// as autocomplete json text/value item(using AutoComplete.CreateAutoCompleteItem); otherwise same as text.
        /// </value>
        return this._value;
    },
    set_value : function(value) {
        this._value = value;
    }
}
AjaxControlToolkit.AutoCompleteItemEventArgs.registerClass('AjaxControlToolkit.AutoCompleteItemEventArgs', Sys.EventArgs);

//END AjaxControlToolkit.AutoComplete.AutoCompleteBehavior.js
//START AjaxControlToolkit.DynamicPopulate.DynamicPopulateBehavior.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />


Type.registerNamespace('AjaxControlToolkit');

AjaxControlToolkit.DynamicPopulateBehavior = function(element) {
    /// <summary>
    /// The DynamicPopulateBehavior replaces the contents of an element with the result of a web service or page method call.  The method call returns a string of HTML that is inserted as the children of the target element.
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM Element the behavior is associated with
    /// </param>
    AjaxControlToolkit.DynamicPopulateBehavior.initializeBase(this, [element]);
    
    this._servicePath = null;
    this._serviceMethod = null;
    this._contextKey = null;
    this._cacheDynamicResults = false;
    this._populateTriggerID = null;
    this._setUpdatingCssClass = null;
    this._clearDuringUpdate = true;
    this._customScript = null;
    
    this._clickHandler = null;
    
    this._callID = 0;
    this._currentCallID = -1;
    
    // Whether or not we've already populated (used for cacheDynamicResults)
    this._populated = false;
}
AjaxControlToolkit.DynamicPopulateBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        AjaxControlToolkit.DynamicPopulateBehavior.callBaseMethod(this, 'initialize');
        $common.prepareHiddenElementForATDeviceUpdate();        
    
        // hook up the trigger if we have one.
        if (this._populateTriggerID) {
            var populateTrigger = $get(this._populateTriggerID);
            if (populateTrigger) {
                this._clickHandler = Function.createDelegate(this, this._onPopulateTriggerClick);
                $addHandler(populateTrigger, "click", this._clickHandler);
            }
        }
    },
    
    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        // clean up the trigger event.
        if (this._populateTriggerID && this._clickHandler) {
            var populateTrigger = $get(this._populateTriggerID);
            if (populateTrigger) {
                $removeHandler(populateTrigger, "click", this._clickHandler);
            }
            this._populateTriggerID = null;
            this._clickHandler = null;
        }
       
        AjaxControlToolkit.DynamicPopulateBehavior.callBaseMethod(this, 'dispose');
    },
    
    populate : function(contextKey) {
        /// <summary>
        /// Get the dymanic content and use it to populate the target element
        /// </summary>
        /// <param name="contextKey" type="String" mayBeNull="true" optional="true">
        /// An arbitrary string value to be passed to the web method. For example, if the element to be
        /// populated is within a data-bound repeater, this could be the ID of the current row.
        /// </param>
        
        // Don't populate if we already cached the results
        if (this._populated && this._cacheDynamicResults) {
            return;
        }

        // Initialize the population if this is the very first call
        if (this._currentCallID == -1) {
            var eventArgs = new Sys.CancelEventArgs();
            this.raisePopulating(eventArgs);
            if (eventArgs.get_cancel()) {
                return;
            }
            this._setUpdating(true);
        }
        
        // Either run the custom population script or invoke the web service
        if (this._customScript) {
            // Call custom javascript call to populate control
            var scriptResult = eval(this._customScript);
            this.get_element().innerHTML = scriptResult; 
            this._setUpdating(false);
         } else {
             this._currentCallID = ++this._callID;
             if (this._servicePath && this._serviceMethod) {
                Sys.Net.WebServiceProxy.invoke(this._servicePath, this._serviceMethod, false,
                    { contextKey:(contextKey ? contextKey : this._contextKey) },
                    Function.createDelegate(this, this._onMethodComplete), Function.createDelegate(this, this._onMethodError),
                    this._currentCallID);
                $common.updateFormToRefreshATDeviceBuffer();
             }
        }
    },

    _onMethodComplete : function (result, userContext, methodName) {
        /// <summary>
        /// Callback used when the populating service returns successfully
        /// </summary>
        /// <param name="result" type="Object" mayBeNull="">
        /// The data returned from the Web service method call
        /// </param>
        /// <param name="userContext" type="Object">
        /// The context information that was passed when the Web service method was invoked
        /// </param>        
        /// <param name="methodName" type="String">
        /// The Web service method that was invoked
        /// </param>

        // ignore if it's not the current call.
        if (userContext != this._currentCallID) return;

        // Time has passed; make sure the element is still accessible
        var e = this.get_element();
        if (e) {
            e.innerHTML = result;
        }

        this._setUpdating(false);
    },

    _onMethodError : function(webServiceError, userContext, methodName) {
        /// <summary>
        /// Callback used when the populating service fails
        /// </summary>
        /// <param name="webServiceError" type="Sys.Net.WebServiceError">
        /// Web service error
        /// </param>
        /// <param name="userContext" type="Object">
        /// The context information that was passed when the Web service method was invoked
        /// </param>        
        /// <param name="methodName" type="String">
        /// The Web service method that was invoked
        /// </param>

        // ignore if it's not the current call.
        if (userContext != this._currentCallID) return;

        var e = this.get_element();
        if (e) {
            if (webServiceError.get_timedOut()) {
                e.innerHTML = AjaxControlToolkit.Resources.DynamicPopulate_WebServiceTimeout;
            } else {
                e.innerHTML = String.format(AjaxControlToolkit.Resources.DynamicPopulate_WebServiceError, webServiceError.get_statusCode());
            }
        }

        this._setUpdating(false);
    },

    _onPopulateTriggerClick : function() {
        /// <summary>
        /// Handler for the element described by PopulateTriggerID's click event
        /// </summary>

        // just call through to the trigger.
        this.populate(this._contextKey);
    },
    
    _setUpdating : function(updating) {
        /// <summary>
        /// Toggle the display elements to indicate if they are being updated or not
        /// </summary>
        /// <param name="updating" type="Boolean">
        /// Whether or not the display should indicated it is being updated
        /// </param>

        this.setStyle(updating);
        
        if (!updating) {
            this._currentCallID = -1;
            this._populated = true;
            this.raisePopulated(this, Sys.EventArgs.Empty);
        }
    },
    
    setStyle : function(updating) {
        /// <summary>
        /// Set the style of the display
        /// </summary>
        /// <param name="updating" type="Boolean">
        /// Whether or not the display is being updated
        /// </param>
        
        var e = this.get_element();
        if (this._setUpdatingCssClass) {
            if (!updating) {
                e.className = this._oldCss;
                this._oldCss = null;
            } else {
                this._oldCss = e.className;
                e.className = this._setUpdatingCssClass;
            }
        }
        
        if (updating && this._clearDuringUpdate) {
            e.innerHTML = "";
        }
    },
    
    get_ClearContentsDuringUpdate : function() {
        /// <value type="Boolean">
        /// Whether the contents of the target should be cleared when an update begins
        /// </value>
        return this._clearDuringUpdate;
    },
    set_ClearContentsDuringUpdate : function(value) {
        if (this._clearDuringUpdate != value) {
            this._clearDuringUpdate = value;
            this.raisePropertyChanged('ClearContentsDuringUpdate');
        }
    },
    
    get_ContextKey : function() {
        /// <value type="String">
        /// An arbitrary string value to be passed to the web method.
        /// For example, if the element to be populated is within a
        /// data-bound repeater, this could be the ID of the current row.
        /// </value>
        return this._contextKey;
    },
    set_ContextKey : function(value) {
        if (this._contextKey != value) {
            this._contextKey = value;
            this.raisePropertyChanged('ContextKey');
        }
    },
    
    get_PopulateTriggerID : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// Name of an element that triggers the population of the target when clicked
        /// </value>
        return this._populateTriggerID;
    },
    set_PopulateTriggerID : function(value) {
        if (this._populateTriggerID != value) {
            this._populateTriggerID = value;
            this.raisePropertyChanged('PopulateTriggerID');
        }
    },
    
    get_ServicePath : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The URL of the web service to call.  If the ServicePath is not defined, then we will invoke a PageMethod instead of a web service.
        /// </value>
        return this._servicePath;
    },
    set_ServicePath : function(value) {
        if (this._servicePath != value) {
            this._servicePath = value;
            this.raisePropertyChanged('ServicePath');
        }
    },
    
    get_ServiceMethod : function() {
        /// <value type="String">
        /// The name of the method to call on the page or web service
        /// </value>
        /// <remarks>
        /// The signature of the method must exactly match the following:
        ///    [WebMethod]
        ///    string DynamicPopulateMethod(string contextKey)
        ///    {
        ///        ...
        ///    }
        /// </remarks>
        return this._serviceMethod;
    },
    set_ServiceMethod : function(value) {
        if (this._serviceMethod != value) {
            this._serviceMethod = value;
            this.raisePropertyChanged('ServiceMethod');
        }
    },
    
    get_cacheDynamicResults : function() {
        /// <value type="Boolean" mayBeNull="false">
        /// Whether the results of the dynamic population should be cached and
        /// not fetched again after the first load
        /// </value>
        return this._cacheDynamicResults;
    },
    set_cacheDynamicResults : function(value) {
        if (this._cacheDynamicResults != value) {
            this._cacheDynamicResults = value;
            this.raisePropertyChanged('cacheDynamicResults');
        }
    },
    
    get_UpdatingCssClass : function() {
        /// <value type="String">
        /// The CSS class to apply to the target during asynchronous calls
        /// </value>
        return this._setUpdatingCssClass;
    },
    set_UpdatingCssClass : function(value) {
        if (this._setUpdatingCssClass != value) {
            this._setUpdatingCssClass = value;
            this.raisePropertyChanged('UpdatingCssClass');
        }
    },
    
    get_CustomScript : function() {
        /// <value type="String">
        /// The script to invoke instead of calling a Web or Page method. This script must evaluate to a string value.
        /// </value>
        return this._customScript;
    },   
    set_CustomScript : function(value) {
        if (this._customScript != value) {
            this._customScript = value;
            this.raisePropertyChanged('CustomScript');
        }
    },
    
    add_populating : function(handler) {
        /// <summary>
        /// Add an event handler for the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populating', handler);
    },
    remove_populating : function(handler) {
        /// <summary>
        /// Remove an event handler from the populating event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populating', handler);
    },
    raisePopulating : function(eventArgs) {
        /// <summary>
        /// Raise the populating event
        /// </summary>
        /// <param name="eventArgs" type="Sys.CancelEventArgs" mayBeNull="false">
        /// Event arguments for the populating event
        /// </param>
        /// <returns />
        
        var handler = this.get_events().getHandler('populating');
        if (handler) {
            handler(this, eventArgs);
        }
    },
    
    add_populated : function(handler) {
        /// <summary>
        /// Add an event handler for the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().addHandler('populated', handler);
    },
    remove_populated : function(handler) {
        /// <summary>
        /// Remove an event handler from the populated event
        /// </summary>
        /// <param name="handler" type="Function" mayBeNull="false">
        /// Event handler
        /// </param>
        /// <returns />
        this.get_events().removeHandler('populated', handler);
    },
    raisePopulated : function(eventArgs) {
        /// <summary>
        /// Raise the populated event
        /// </summary>
        /// <param name="eventArgs" type="Sys.EventArgs" mayBeNull="false">
        /// Event arguments for the populated event
        /// </param>
        /// <returns />
         
        var handler = this.get_events().getHandler('populated');
        if (handler) {
            handler(this, eventArgs);
        }
    }
}
AjaxControlToolkit.DynamicPopulateBehavior.registerClass('AjaxControlToolkit.DynamicPopulateBehavior', AjaxControlToolkit.BehaviorBase);

//END AjaxControlToolkit.DynamicPopulate.DynamicPopulateBehavior.js
//START AjaxControlToolkit.PopupControl.PopupControlBehavior.js
// (c) Copyright Microsoft Corporation.
// This source is subject to the Microsoft Permissive License.
// See http://www.microsoft.com/resources/sharedsource/licensingbasics/sharedsourcelicenses.mspx.
// All other rights reserved.


/// <reference name="MicrosoftAjax.debug.js" />
/// <reference name="MicrosoftAjaxTimer.debug.js" />
/// <reference name="MicrosoftAjaxWebForms.debug.js" />
/// <reference path="../ExtenderBase/BaseScripts.js" />
/// <reference path="../Common/Common.js" />
/// <reference path="../DynamicPopulate/DynamicPopulateBehavior.js" />
/// <reference path="../Compat/Timer/Timer.js" />
/// <reference path="../Animation/Animations.js" />
/// <reference path="../Animation/AnimationBehavior.js" />
/// <reference path="../PopupExtender/PopupBehavior.js" />


Type.registerNamespace('AjaxControlToolkit');

AjaxControlToolkit.PopupControlBehavior = function(element) {
    /// <summary>
    /// The PopupControlBehavior opens a popup window next to the target element
    /// </summary>
    /// <param name="element" type="Sys.UI.DomElement" domElement="true">
    /// DOM element associated with the behavior
    /// </param>
    AjaxControlToolkit.PopupControlBehavior.initializeBase(this, [element]);
    
    // Properties
    this._popupControlID = null;
    this._commitProperty = null;
    this._commitScript = null;
    this._position = null;
    this._offsetX = 0;
    this._offsetY = 0;
    this._extenderControlID = null;

    // Variables
    this._popupElement = null;
    this._popupBehavior = null;
    this._popupVisible = false;
    this._focusHandler = null;
    this._popupKeyDownHandler = null;
    this._popupClickHandler = null;
    this._bodyClickHandler = null;
    this._onShowJson = null;
    this._onHideJson = null;
}
AjaxControlToolkit.PopupControlBehavior.prototype = {
    initialize : function() {
        /// <summary>
        /// Initialize the behavior
        /// </summary>
        AjaxControlToolkit.PopupControlBehavior.callBaseMethod(this, 'initialize');

        // Identify popup element from control id
        var e = this.get_element();
        this._popupElement = $get(this._popupControlID);

        // Hook up a PopupBehavior
        this._popupBehavior = $create(AjaxControlToolkit.PopupBehavior, { 'id':this.get_id()+'PopupBehavior', 'parentElement':e }, null, null, this._popupElement);
        
        // Create the animations (if they were set before initialize was called)
        if (this._onShowJson) {
            this._popupBehavior.set_onShow(this._onShowJson);
        }
        if (this._onHideJson) {
            this._popupBehavior.set_onHide(this._onHideJson);
        }

        // Create delegates
        this._focusHandler = Function.createDelegate(this, this._onFocus);
        this._popupClickHandler = Function.createDelegate(this, this._onPopupClick);
        this._bodyClickHandler = Function.createDelegate(this, this._onBodyClick);
        this._popupKeyDownHandler = Function.createDelegate(this, this._onPopupKeyDown);

        // Attach events
        $addHandler(e, 'focus', this._focusHandler);
        $addHandler(e, 'click', this._focusHandler);  // So that a dismissed popup can be more easily re-popped
        $addHandler(document.body, 'click', this._bodyClickHandler);
        $addHandler(this._popupElement, 'click', this._popupClickHandler);
        $addHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);

        // Need to know when partial updates complete
        this.registerPartialUpdateEvents();

        // If this popup was visible before what seems to have been a partial update,
        // make it visible again now
        if(AjaxControlToolkit.PopupControlBehavior.__VisiblePopup && (this.get_id() == AjaxControlToolkit.PopupControlBehavior.__VisiblePopup.get_id())) {
            this._onFocus(null);
        }
    },

    dispose : function() {
        /// <summary>
        /// Dispose the behavior
        /// </summary>

        var e = this.get_element();
    
        this._onShowJson = null;
        this._onHideJson = null;

        if (this._popupBehavior) {
            this._popupBehavior.dispose();
            this._popupBehavior = null;
        }
        if (this._focusHandler) {
            $removeHandler(e, 'focus', this._focusHandler);
            $removeHandler(e, 'click', this._focusHandler);
            this._focusHandler = null;
        }
        if (this._bodyClickHandler) {
            $removeHandler(document.body, 'click', this._bodyClickHandler);
            this._bodyClickHandler = null;
        }
        if (this._popupClickHandler) {
            $removeHandler(this._popupElement, 'click', this._popupClickHandler);
            this._popupClickHandler = null;
        }
        if (this._popupKeyDownHandler) {
            $removeHandler(this._popupElement, 'keydown', this._popupKeyDownHandler);
            this._popupKeyDownHandler = null;
        }
        AjaxControlToolkit.PopupControlBehavior.callBaseMethod(this, 'dispose');
    },

    showPopup : function() {
        /// <summary>
        /// Display the popup
        /// </summary>

        var old = AjaxControlToolkit.PopupControlBehavior.__VisiblePopup;
        if (old && old._popupBehavior) {
            old.hidePopup();
        }

        AjaxControlToolkit.PopupControlBehavior.callBaseMethod(this, 'populate');
        
        this._popupBehavior.set_x(this._getLeftOffset());
        this._popupBehavior.set_y(this._getTopOffset());
        this._popupBehavior.show();
        
        this._popupVisible = true;
        AjaxControlToolkit.PopupControlBehavior.__VisiblePopup = this;
    },

    hidePopup : function() {
        /// <summary>
        /// Hide the popup
        /// </summary>
        
        this._popupBehavior.hide();
        this._popupVisible = false;
        AjaxControlToolkit.PopupControlBehavior.__VisiblePopup = null;
    },

    _onFocus : function(e) {
        /// <summary>
        /// Show the popup when its control is focused
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent" mayBeNull="true">
        /// Event info
        /// </param>
        
        // Set the popup position and display it
        if (!this._popupVisible) {
            this.showPopup();
        }
        if (e) {
            e.stopPropagation();
        }
    },

    _onPopupKeyDown : function(e) {
        /// <summary>
        /// Handle key presses in the popup element
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>

        // Handle key presses in the popup element
        if (this._popupVisible && e.keyCode == 27 /* Escape */) {
            // Return focus to the control
            this.get_element().focus();
        }
    },

    _onPopupClick : function(e) {
        /// <summary>
        /// Click handler for the popup
        /// </summary>
        /// <param name="e" type="Sys.UI.DomEvent">
        /// Event info
        /// </param>
        e.stopPropagation();
    },

    _onBodyClick : function() {
        /// <summary>
        /// Handler for the HTML body tag's click event
        /// </summary>

        // Hide the popup if something other than our target or popup
        // was clicked (since each of these stop the event from bubbling
        // up to the body)
        if (this._popupVisible) {
            this.hidePopup();
        }
    },

    // Called automatically when a page load/postback happens
    _close : function(result) {
        /// <summary>
        /// Close the popup
        /// </summary>
        /// <param name="result" type="String">
        /// Result obtained from committing the popup
        /// </param>

        // Look at result of popup
        var e = this.get_element();

        if (null != result) {
            if ('$$CANCEL$$' != result) {
                // Result is to be committed
                if (this._commitProperty) {
                    // Use the specified property
                    e[this._commitProperty] = result;
                } else if ('text' == e.type) {
                    // Use the default property
                    e.value = result;
                } else {
                    Sys.Debug.assert(false, String.format(AjaxControlToolkit.Resources.PopupControl_NoDefaultProperty, e.id, e.type));
                }
                // Additionally run commit script if present
                if (this._commitScript) {
                    eval(this._commitScript);
                }
            }

            // Hide the popup
            this.hidePopup();
        }
    },

    _partialUpdateEndRequest : function(sender, endRequestEventArgs) {
        /// <summary>
        /// Handler for UpdatePanel partial postback notifications
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="endRequestEventArgs" type="Sys.WebForms.EndRequestEventArgs">
        /// Event arguments
        /// </param>
        AjaxControlToolkit.PopupControlBehavior.callBaseMethod(this, '_partialUpdateEndRequest', [sender, endRequestEventArgs]);

        if (this.get_element()) {
            // Look up result by element's ID
            var result = endRequestEventArgs.get_dataItems()[this.get_element().id];

            // If unsuccessful, look up result by proxy ID
            if ((undefined === result) &&
                AjaxControlToolkit.PopupControlBehavior.__VisiblePopup &&
                (this.get_id() == AjaxControlToolkit.PopupControlBehavior.__VisiblePopup.get_id())) {
                    result = endRequestEventArgs.get_dataItems()["_PopupControl_Proxy_ID_"];
            }

            // If result available, apply it
            if (undefined !== result) {
                this._close(result);
            }
        }
    },

    _onPopulated : function(sender, eventArgs) {
        /// <summary>
        /// Handler for DynamicPopulate completion
        /// </summary>
        /// <param name="sender" type="Object">
        /// Sender
        /// </param>
        /// <param name="eventArgs" type="Sys.EventArgs">
        /// Event arguments
        /// </param>
        AjaxControlToolkit.PopupControlBehavior.callBaseMethod(this, '_onPopulated', [sender, eventArgs]);

        // Dynamic populate may have added content; re-layout to accomodate it
        if (this._popupVisible) {
            this._popupBehavior.show();
        }
    },

    _getLeftOffset : function() {
        /// <summary>
        /// Get the left offset for the popup
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Left offset for the popup
        /// </returns>
 
        // Get the left offset for the popup
        if (AjaxControlToolkit.PopupControlPopupPosition.Left == this._position) {
            return (-1 * this.get_element().offsetWidth) + this._offsetX;
        } else if (AjaxControlToolkit.PopupControlPopupPosition.Right == this._position) {
            return this.get_element().offsetWidth + this._offsetX;
        } else {
            return this._offsetX;
        }
    },

    _getTopOffset : function() {
        /// <summary>
        /// Get the top offset for the popup
        /// </summary>
        /// <returns type="Number" integer="true">
        /// Top offset for the popup
        /// </returns>

        // Get the top offset for the popup
        var yoffSet;
        if(AjaxControlToolkit.PopupControlPopupPosition.Top == this._position) {
            yoffSet =  (-1 * this.get_element().offsetHeight) + this._offsetY;
        } else if (AjaxControlToolkit.PopupControlPopupPosition.Bottom == this._position) {
            yoffSet =  this.get_element().offsetHeight + this._offsetY;
        } else {
            yoffSet = this._offsetY;
        }
        
        return yoffSet;
    },
    
    get_onShow : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnShow Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShow() : this._onShowJson;
    },
    set_onShow : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onShow(value)
        } else {
            this._onShowJson = value;
        }
        this.raisePropertyChanged('onShow');
    },
    get_onShowBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnShow Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onShowBehavior() : null;
    },
    onShow : function() {
        /// <summary>
        /// Play the OnShow animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onShow();
        }
    },
        
    get_onHide : function() {
        /// <value type="String" mayBeNull="true">
        /// Generic OnHide Animation's JSON definition
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHide() : this._onHideJson;
    },
    set_onHide : function(value) {
        if (this._popupBehavior) {
            this._popupBehavior.set_onHide(value)
        } else {
            this._onHideJson = value;
        }
        this.raisePropertyChanged('onHide');
    },
    get_onHideBehavior : function() {
        /// <value type="AjaxControlToolkit.Animation.GenericAnimationBehavior">
        /// Generic OnHide Animation's behavior
        /// </value>
        return this._popupBehavior ? this._popupBehavior.get_onHideBehavior() : null;
    },
    onHide : function() {
        /// <summary>
        /// Play the OnHide animation
        /// </summary>
        /// <returns />
        if (this._popupBehavior) {
            this._popupBehavior.onHide();
        }
    },
    
    get_PopupControlID : function() {
        /// <value type="String">
        /// The ID of the control to display
        /// </value>
        return this._popupControlID;
    },
    set_PopupControlID : function(value) {
        if (this._popupControlID != value) { 
            this._popupControlID = value;
            this.raisePropertyChanged('PopupControlID');
        }
    },

    get_CommitProperty : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// The property on the control being extended that should be set with the result of the popup
        /// </value>
        return this._commitProperty;
    },
    set_CommitProperty : function(value) {
        if (this._commitProperty != value) {
            this._commitProperty = value;
            this.raisePropertyChanged('CommitProperty');
        }
    },

    get_CommitScript : function() {
        /// <value type="String" mayBeNull="true" optional="true">
        /// Additional script to run after setting the result of the popup
        /// </value>
        return this._commitScript;
    },
    set_CommitScript : function(value) {
        if (this._commitScript != value) {
            this._commitScript = value;
            this.raisePropertyChanged('CommitScript');
        }
    },

    get_Position : function() {
        /// <value type="AjaxControlToolkit.PopupControlPopupPosition">
        /// Where the popup should be positioned relative to the target control. (Left, Right, Top, Bottom, Center)
        /// </value>
        return this._position;
    },
    set_Position : function(value) {
        if (this._position != value) {
            this._position = value;
            this.raisePropertyChanged('Position');
        }
    },

// TODO: Is this used anywhere?
    get_ExtenderControlID : function() {
        /// <value type="String">
        /// ID of the extender control
        /// </value>
        return this._extenderControlID;
    },
    set_ExtenderControlID : function(value) {
        if (this._extenderControlID != value) {
            this._extenderControlID = value;
            this.raisePropertyChanged('ExtenderControlID');
        }
    },

    get_OffsetX : function() {
        /// <value type="Number" integer="true">
        /// The number of pixels to horizontally offset the Popup from its default position
        /// </value>
        return this._offsetX;
    },
    set_OffsetX : function(value) {
        if (this._offsetX != value) {
            this._offsetX = value;
            this.raisePropertyChanged('OffsetX');
        }
    },

    get_OffsetY : function() {
        /// <value type="Number" integer="true">
        /// The number of pixels to vertically offset the Popup from its default position
        /// </value>
        return this._offsetY;
    },
    set_OffsetY : function(value) {
        if (this._offsetY != value) {
            this._offsetY = value;
            this.raisePropertyChanged('OffsetY');
        }
    },
    
    get_PopupVisible : function() {
        /// <value type="Boolean">
        /// Whether the popup control is currently visible
        /// </value>
        return this._popupVisible;
    }
}
AjaxControlToolkit.PopupControlBehavior.registerClass('AjaxControlToolkit.PopupControlBehavior', AjaxControlToolkit.DynamicPopulateBehaviorBase);

// This global variable tracks the currently visible popup.  Automatically
// hiding the popup when focus is lost does not work with our mechanism to
// hide the popup when something else is clicked... So we will instead go for
// the weaker strategy of letting at most one popup be visible at a time.
AjaxControlToolkit.PopupControlBehavior.__VisiblePopup = null;


AjaxControlToolkit.PopupControlPopupPosition = function() {
    /// <summary>
    /// Position of the popup relative to the target control
    /// </summary>
    /// <field name="Center" type="Number" integer="true" />
    /// <field name="Top" type="Number" integer="true" />
    /// <field name="Left" type="Number" integer="true" />
    /// <field name="Bottom" type="Number" integer="true" />
    /// <field name="Right" type="Number" integer="true" />
    throw Error.invalidOperation();
}
AjaxControlToolkit.PopupControlPopupPosition.prototype = {
    Center : 0,
    Top : 1,
    Left : 2,
    Bottom : 3,
    Right : 4
}
AjaxControlToolkit.PopupControlPopupPosition.registerEnum("AjaxControlToolkit.PopupControlPopupPosition", false);

//END AjaxControlToolkit.PopupControl.PopupControlBehavior.js
if(typeof(Sys)!=='undefined')Sys.Application.notifyScriptLoaded();
(function() {var fn = function() {$get('Mastersearch_ScriptManager1_HiddenField').value += ';;AjaxControlToolkit, Version=1.0.11119.23407, Culture=neutral, PublicKeyToken=28f01b0e84b6d53e:en-US:a0781f64-5a53-474d-9116-be957a35bc84:411fea1c:865923e8:e7c87f07:91bd373d:bbfda34c:30a78ec5:3510d9fc:596d588c:42b7c466';Sys.Application.remove_load(fn);};Sys.Application.add_load(fn);})();
