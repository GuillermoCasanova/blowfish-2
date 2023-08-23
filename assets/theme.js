window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap iframes and tables in div tags to force responsive/scrollable layout.
 *
 * @namespace rte
 */

slate.rte = {
  /**
   * Wrap tables in a container div to make them scrollable when needed
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$tables - jquery object(s) of the table(s) to wrap
   * @param {string} options.tableWrapperClass - table wrapper class name
   */
  wrapTable: function(options) {
    var tableWrapperClass = typeof options.tableWrapperClass === "undefined" ? '' : options.tableWrapperClass;

    options.$tables.wrap('<div class="' + tableWrapperClass + '"></div>');
  },

  /**
   * Wrap iframes in a container div to make them responsive
   *
   * @param {object} options - Options to be used
   * @param {jquery} options.$iframes - jquery object(s) of the iframe(s) to wrap
   * @param {string} options.iframeWrapperClass - class name used on the wrapping div
   */
  wrapIframe: function(options) {
    var iframeWrapperClass = typeof options.iframeWrapperClass === "undefined" ? '' : options.iframeWrapperClass;

    options.$iframes.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="' + iframeWrapperClass + '"></div>');
      
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_space_separator':
        value = formatWithDelimiters(cents, 2, ' ', '.');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, ',', '.');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);

      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param {object} variant - Currently selected variant
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param {object} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Sections ================*/
/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    optionSelector: '[data-option-selector]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    header: '[data-header]',
    product: '[data-product]',
    products: '[data-products]',
    productPageNav: '[data-product-page-nav]',
    productPageNavScroll: '[data-product-page-nav-scroll]',
    productPageNavLinks: '[data-product-page-nav-link]',
    productPageNavItems: '[data-product-page-nav-item]'
  };


  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    var sectionId = this.$container.attr('data-section-id');
    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());

    var options = {
      $container: this.$container,
      enableHistoryState: this.$container.data('enable-history-state') || false,
      singleOptionSelector: selectors.singleOptionSelector,
      originalSelectorId: selectors.originalSelectorId,
      product: this.productSingleObject
    };

    this.settings = {};
    this.namespace = '.product';
    this.variants = new slate.Variants(options);
    this.$featuredImage = $(selectors.productFeaturedImage, this.$container);

    this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
    this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));

    if (this.$featuredImage.length > 0) {
      this.settings.imageSize = slate.Image.imageSize(this.$featuredImage.attr('src'));
      slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
    }

    this.productPageNav.init(); 
    this.initAjaxCart(); 
    

  }

  Product.prototype = $.extend({}, Product.prototype, {

    productPageNav:  {
      init: function() {

        let that = this; 

        this.$productPageNavLinks = $(selectors.productPageNavLinks); 
        this.currentProductHandle = (window.location.pathname).replace('/products/', ''); 
        this.$productPageNavItems = $(selectors.productPageNavItems);
        this.$productPageNavScroll = $(selectors.productPageNavScroll); 
        this.$products = $(selectors.products);  
        var $productPageNavScroll = $('[data-product-page-nav-scroll]'); 

        this.setActiveProduct(this.currentProductHandle);

        if(!window.location.hash) {
         that.goToProduct("#" + this.currentProductHandle, false); 
        }

        this.$productPageNavLinks.on('click', function(e) {
         e.preventDefault(); 
         let productId = $(this).attr("href").replace('#', ''); 
         that.setActiveProduct(productId); 
         that.goToProduct($(this).attr("href"), true); 
        });
      },
      setActiveProduct: function(pProductHandle, pSpeed) {

        let id = pProductHandle;

        this.$productPageNavItems.removeClass('is-active'); 

        this.$productPageNavItems.each(function() {

         var linkHandle = $(this).find('a').attr("href").replace('#', '');

         if(linkHandle == pProductHandle) {
            $(this).addClass('is-active');
         }
        }); 

        var active = this.$productPageNavScroll.find('.is-active'); // find the active element
        var activeWidth = active.width() / 2; // get active width center

        var pos = active.position().left + activeWidth; //get left position of active li + center position
        var elpos = this.$productPageNavScroll.scrollLeft(); // get current scroll position
        var elW = this.$productPageNavScroll.width(); //get div width
        //var divwidth = $(elem).width(); //get div width
        pos = pos + elpos - elW / 2; // for center position if you want adjust then change this

        this.$productPageNavScroll.animate({
          scrollLeft: pos
        }, pSpeed == undefined ? 600 : pSpeed);
        return this;

      }, 
      goToProduct: function(pProductId, pAnimateToSection) {

        if(pProductId === $(this.$productPageNavLinks[0]).attr("href")) {
          return false 
        }

        let that = this; 
        let sectionDistanceFromTop = this.$products.find(pProductId).offset().top; 
        let speed = pAnimateToSection ? 1000 : 0; 

        $('html, body').animate({
          scrollTop: sectionDistanceFromTop - 120
        }, speed)
      }
    },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      var variant = evt.variant;

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
    },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      this.$featuredImage.attr('src', sizedImgUrl);
    },
    
    /**
     * Initializes the AJAX cart with product template properties  
     */
    initAjaxCart: function() {
      //  ajaxCart.init({
      //     formSelector: '#AddToCartForm--' + this.$container.attr('data-section-id'),
      //     cartContainer: '#CartContainer',
      //     addToCartSelector: '#AddToCart--' + this.$container.attr('data-section-id'),
      //     moneyFormat: theme.strings.moneyFormat
      // });
    },
    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }

  });

  return Product;
  
})();

/**
 * Header Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Header template.
 *
   * @namespace header
 */

theme.Header = (function() {


  var selectors = {
    offCanvasMenu: '[data-off-canvas-menu]',
    offCanvasCart: '[data-off-canvas-cart]',
    offCanvasCartOverlay: '[data-off-canvas-cart-overlay]',
    closeOffCanvasCart: '[data-close-off-canvas-cart]',
    menuToggle: '[data-menu-toggle]',
    menuContainer: '[data-menu]',
    navigation: '[data-main-navigation]',
    cartToggle: '[data-cart-toggle]',
    cartIcon: '[data-cart-icon]',
    dropdownOverlay: '[data-dropdown-overlay]',
    navigationLink: '[data-navigation-link]'
  };

  var $offCanvasMenu = $(selectors.offCanvasMenu);
  var $offCanvasCart = $(selectors.offCanvasCart); 
  var $dropdownOverlay = $(selectors.dropdownOverlay); 
  var $navigation = $(selectors.navigation); 
  var $navigationLinks =  $(selectors.navigationLink); 
  var $offCanvasCartOverlay = $(selectors.offCanvasCartOverlay); 
  var $cartIcon = $(selectors.cartIcon); 
  var $body = $('body');

  var $menuToggle = $(selectors.menuToggle); 
  var menuContainer = $(selectors.menuContainer);
  var menuIsOpen = false; 
  var offCanvasCartOpen = false; 
  var openSection = false; 
  

  /*------------------------------------*\
      #Sticky Main Nav Styles Toggle
  \*------------------------------------*/

  // Variable to detect if user is smooth scrolling to a section
  var smoothScrolling = false; 

  // Checks to see if there is a '[data-action="toggle-top-bar"]' to hide/show
  // This prevents it from activating on small devices. 
  if($('[sticky-nav]').length > 0) {

      //
      // Function checks to see if the user is scrolling, 
      // if they are, 

      (function($){

          var prevScroll = 0;
          var currentScroll; 
          var stickyNavContainer = $('[sticky-nav]');
          var navBar = $(selectors.navigation);
          var cart = $(selectors.cartIcon); 
          var navBarHeight = navBar.height(); 
          var didScroll = false; 
          var theWindow = $(window);


          $(window).scroll(function() {
              didScroll = true;
          });
           
          setInterval(function() {

            if (didScroll) {

              didScroll = false; 

              currentScroll = theWindow.scrollTop();
              
              if(100 < currentScroll) {
                navBar.addClass('main-nav--fixed');  
                navBar.removeClass('main-nav--alt');
              } else {
                navBar.removeClass('main-nav--fixed');
              }

               prevScroll = currentScroll; 

            } 

          }, 300);

      })(jQuery);
  }

  /*------------------------------------*\
      #Nav Styles Toggle Based on page 
  \*------------------------------------*/

  //If the user is on the hangover-science.html page, show the alt styling for the nav and cart
  //  

  var altNavPage = '/pages/hangover-science'; 

  var hideLogoPage = '/'; 

  (function($) {
    console.log(window.location.pathname); 

    if(window.location.pathname === altNavPage) {
     $navigation.addClass('mainNav--alt');
     $cartIcon.addClass('cart--alt'); 
    }

    if(window.location.pathname === hideLogoPage) {
      $navigation.addClass('is-logo-hidden');
    }

  })(jQuery);



  var Header = function(container) {
    
    var that = this; 
    var loadingSection = false; 

    this.$container = $(container); 

    var toggleMenuIcon = function() {
      if($menuToggle.hasClass('is-menu-open')) {
        $menuToggle.removeClass('is-menu-open');
        $menuToggle.addClass('is-menu-closed');
      } else {
        $menuToggle.removeClass('is-menu-closed');
        $menuToggle.addClass('is-menu-open');
      }
    }

    this.toggleNavigation = function()   {

      if($offCanvasMenu.hasClass('is-open')) {
        $offCanvasMenu.removeClass('is-open');
        $offCanvasMenu.addClass('is-closed');
        $menuToggle.removeClass('is-open');
        $menuToggle.addClass('is-closed');
        menuIsOpen = false;    
      } else{
        $offCanvasMenu.addClass('is-open');
        $offCanvasMenu.removeClass('is-closed');
        $menuToggle.addClass('is-open');
        $menuToggle.removeClass('is-closed');
        menuIsOpen = true;    
      }
    }

    //** Toggles the cart, loads it with AJAXCART.JS **//
    this.toggleCart = function() {
      if($offCanvasCart.hasClass('is-open')) {
        $offCanvasCart.removeClass('is-open');
        $offCanvasCart.addClass('is-closed');
        $offCanvasCartOverlay.removeClass('is-showing');
        $offCanvasCartOverlay.addClass('is-hidden');
        offCanvasCartOpen = false;    
      } else{
        ajaxCart.load(); 
        $offCanvasCart.addClass('is-open');
        $offCanvasCart.removeClass('is-closed');
        $offCanvasCartOverlay.addClass('is-showing');
        $offCanvasCartOverlay.removeClass('is-hidden');
        offCanvasCartOpen = true;    
      }
    }

    this.closeCart = function() {
      $offCanvasCart.removeClass('is-open');
      $offCanvasCart.addClass('is-closed');
      $offCanvasCartOverlay.removeClass('is-showing');
      $offCanvasCartOverlay.addClass('is-hidden')
      offCanvasCartOpen = false;    
    }

    this.showOverlay = function() {
      $dropdownOverlay.removeClass('is-hidden');
      $dropdownOverlay.addClass('is-showing');
    }

    this.hideOverlay = function() {
      $dropdownOverlay.removeClass('is-showing');
      $dropdownOverlay.addClass('is-hidden');
    }


    //
    // Sets up transtion-delay on all links for stagger animation effect
    //
    var menuItems = $('.mainNav-animElem');  

    for(var i = 0; i < menuItems.length; i++) {
      var item = menuItems[i]; 
      $(item).css('transition-delay', (.02 * i) + 's');
    }


    //
    // Setup mobile-specific jquery 
    //
    this.mobileNavInit = function() {

      $(selectors.menuToggle).off('click'); 
      
      $(selectors.menuToggle).on('click', function(event) {
        that.toggleNavigation(); 
      }); 

      this.initCart(); 

    }


    //
    // Setup desktop-specific jquery 
    //
    this.desktopNavInit = function() {
      this.initCart(); 
    }

    this.initCart = function() {
      $(selectors.cartToggle).off('click'); 

      $(selectors.cartToggle).on('click', function(event) {
        that.toggleCart(); 
      }); 

      $(selectors.closeOffCanvasCart).on('click', function(event) {
        that.closeCart(); 
      }); 
    }


    //
    // Sets up cart events
    //
    this.cartEventsInit = function() {
      $body.on('ajaxCart.cart-is-empty', function() {
        $cartIcon.removeClass('is-filled'); 
        $cartIcon.addClass('is-empty'); 
      });

       $body.on('ajaxCart.cart-is-filled', function() {
        $cartIcon.removeClass('is-empty'); 
        $cartIcon.addClass('is-filled'); 
      })
    }



    var timerId = null;

    var  throttle  =  function (func, delay) {
      // If setTimeout is already scheduled, no need to do anything
      if (timerId) {
        return
      }

      // Schedule a setTimeout after delay seconds
      timerId  =  setTimeout(function () {
        func()
        
        // Once setTimeout function execution is finished, timerId = undefined so that in <br>
        // the next scroll event function execution can be scheduled by the setTimeout
        timerId  =  undefined;
      }, delay)
    }

    //
    // Inits the nav 
    //
    this.initNav = function() {

      this.cartEventsInit(); 

      var currentBreakpoint = window.getComputedStyle(
          document.querySelector('body'), ':before'
      ).getPropertyValue('content').replace(/"/g, "");

      if(currentBreakpoint == 'medium-up' || currentBreakpoint == 'large-up') {
        that.desktopNavInit(); 
      } else {
        that.mobileNavInit(); 
      } 
    }

     this.initNav(); 

     $(window).on('resize', function() {
        throttle(function() {
          that.initNav(); 
        }, 1000)
     });

  };


  //
  // Open cart global method  
  //
  Header.openCart = function() {
    $offCanvasCart.removeClass('is-closed');
    $offCanvasCart.addClass('is-open');
    $offCanvasCartOverlay.addClass('is-showing');
    $offCanvasCartOverlay.removeClass('is-hidden');
    offCanvasCartOpen = true; 
  }; 

  return Header;

})();








/**
 * Featured Products Section Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Featured Products Section.
 *
   * @namespace featuredProducts
 */

theme.FeaturedProducts = (function() {


  var selectors = {
     products: '[data-featured-product]',
     productLinks: '[data-product-link]',
     productsContainer: '[data-featured-products-container]'
  };

  var FeaturedProducts = function(container) {

    this.$container = $(container);

    if (!$(selectors.productsContainer).length > 0) {
      return;
    }
    
    this.init(); 
  };


  FeaturedProducts.prototype = $.extend({}, FeaturedProducts.prototype, {

    init: function() {

      let that  = this; 
      let $products = $(selectors.products); 

      let initFunctionality = function(pCurrentBreakpoint) {
        setTimeout(function() {
          if(pCurrentBreakpoint == 'large-up') {
            that.initDesktop();
          } else {
            that.initMobile(); 
          }
        }, 200);   

      }

      var timerId = null;

      var  throttle  =  function (func, delay) {
        // If setTimeout is already scheduled, no need to do anything
        if (timerId) {
          return
        }

        // Schedule a setTimeout after delay seconds
        timerId  =  setTimeout(function () {
          func()
          
          // Once setTimeout function execution is finished, timerId = undefined so that in <br>
          // the next scroll event function execution can be scheduled by the setTimeout
          timerId  =  undefined;
        }, delay)
      }


     $(window).on('resize', function() {
       throttle(function() {
        initFunctionality(that.getCurrentBreakPoint()); 
      }, 600); 
     }); 

     initFunctionality(that.getCurrentBreakPoint()); 

     $products.each(function(index) {
       let $productContainer = $(this); 

       $productContainer.find(selectors.productLinks).hover(function() {
         $(this).parent().addClass('is-hovered');
       }, function() {
         $(this).parent().removeClass('is-hovered');
       });

       $productContainer.find(selectors.productLinks).focus(function() {
         $(this).parent().addClass('is-hovered');
       }, function() {
         $(this).parent().removeClass('is-hovered');
       });

     });

    },
    getCurrentBreakPoint: function() {
      let currentBreakpoint = window.getComputedStyle(
          document.querySelector('body'), ':before'
      ).getPropertyValue('content').replace(/"/g, "");

      return currentBreakpoint; 
    }, 
    initMobile: function() {

      if(this.$slideshow) {
        this.featuredProductsSlidehow.destroy(true, true);
        this.$slideshow.removeClass('swiper-container');
        this.$slides.unwrap(".swiper-wrapper");
        this.$slides.removeClass('swiper-slide');
        $('.swiper-pagination').remove();  
      }

      let swiperComponents = '<div class="swiper-pagination"></div>'

      this.$slideshow = $(selectors.productsContainer); 
      this.$slides = $(selectors.products);

      this.$slideshow.addClass('swiper-container');
      this.$slides.wrapAll("<div class='swiper-wrapper'/>");
      this.$slides.addClass('swiper-slide'); 
      this.$slideshow.append(swiperComponents);


      var slideshowOptions = {}; 

      if(this.getCurrentBreakPoint() == 'medium-up') {
        slideshowOptions = {
          direction: 'horizontal',
          slidesPerView: 1,
          autoHeight: true,
          spaceBetween: 0, 
          slidesPerView: 2, 
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        }
      } 

      if(this.getCurrentBreakPoint() == 'small') {
        slideshowOptions = {
          direction: 'horizontal',
          slidesPerView: 1,
          autoHeight: true,
          spaceBetween: 30, 
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true
          }
        }
      } 

      this.featuredProductsSlidehow = new Swiper(selectors.productsContainer, slideshowOptions);


    },
    initDesktop: function() {

      if(this.$slideshow) {
        this.featuredProductsSlidehow.destroy(true, true);
        this.$slideshow.removeClass('swiper-container');
        this.$slides.unwrap(".swiper-wrapper");
        this.$slides.removeClass('swiper-slide');
        $('.swiper-pagination').remove();  
      }
    }

  });

  return FeaturedProducts;

})();




/*================ Services ================*/

var NavState = (function() {
    
    var makeNavMinimal = function() {
       $('[data-main-navigation]').addClass('main-nav--minimal');
    };


    var makeNavFull = function() {
       $('[data-main-navigation]').removeClass('main-nav--minimal');
    };


    var makeNavAlt = function() {
       $('[data-main-navigation]').addClass('main-nav--alt');  
       $('[data-cart-icon]').addClass('is-alt');
    };


    var makeNavNormal = function() {
       $('[data-main-navigation]').removeClass('main-nav--alt');  
       $('[data-cart-icon]').removeClass('is-alt');
    };

    return NavState = {
      makeNavMinimal: makeNavMinimal,
      makeNavFull: makeNavFull, 
      makeNavAlt: makeNavAlt,
      makeNavNormal: makeNavNormal
    }

})(); 




/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();

/**
 * Hangover Science Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Hangover Science template.
 *
 * @namespace hangover science
 */

theme.hangoverScience = (function() {

	$(document).ready(function() {

	  if($('[data-ui-component="hangover-science-narrative"]').length > 0 ) {


      //
      //Uses the NavState service to toggle classes of the navigation
      //
      NavState.makeNavAlt();

	    var nextSlideBtn = $('[data-action="go-to-next-slide"]'); 

	    var backToTopBtn = $('[data-action="go-to-first-slide"]'); 


	    //
	    //Function that can be used and inserted to check if we are on a mobile device
	    //
	    var checkIfMobile = function() {

	      var mediumUpDeviceBreakpoint  = 700; 

	      var windowWidth = $(window).width(); 

	      if(windowWidth > mediumUpDeviceBreakpoint) {

	          return false;

	      } else {

	          return true; 
	      }

	    };


	    //
	    //If this device is wide enough, we enable fullpage js 
	    //
	    if(!checkIfMobile()) {

		    $('[data-ui-component="hangover-science-narrative"]').fullpage( {


		        //
		        //Menu
		        //
		        menu: '[data-ui-component="hangover-science-narrative-menu"]',
		        anchors:['Hangover-Science', 
		                 'Headache',
		                 'Nausea',
		                 'Dehydration', 
		                 'Irritability',
		                 'Fatigue',
		                 'Impaired-Mental-Function',
		                 'Sensitivity',
		                 'Difficulty-Focusing',
		                 'Blowfish-For-Hangovers'],
		        navigation: true,

		        //
		        //Accesibility
		        //
		        animateAnchor: false, 

		        //
		        //Scrolling
		        //
		        scrollingSpeed: 1000, 
		        easing: 'easeInOutQuint',
		        
		        //
		        //Slides 
		        //
		        sectionSelector: '[data-ui-component="hangover-science-narrative-slide"]',

		        //
		        //Events
		        //
		        onLeave: function(index, nextIndex, direction) {

		          //
		          //Uses the NavState service to toggle classes of the navigation
		          //
		          NavState.makeNavMinimal();

	            if(nextIndex % 2 === 0 ) {
	              NavState.makeNavNormal(); 
	            } 

	            if(nextIndex % 2 === 1) {

	              NavState.makeNavAlt(); 
	            }

	            if(nextIndex === 1) {

	              NavState.makeNavFull();

	            }

	            if(nextIndex === 10) {
	          		NavState.makeNavFull();
	            }

	            if(nextIndex === 10) {
	            	$('.narrative-footer').addClass("is-showing"); 
	            } else {
	            	$('.narrative-footer').removeClass("is-showing"); 
	            }
		        }
		    }); 

	    }


	    //
	    //Whecn clicked, used method to go to next slide
	    //

	    nextSlideBtn.on('click', function() {

	      $.fn.fullpage.moveSectionDown();

	    }); 


	    //
	    //Whecn clicked, used method to go to first slide in narrative
	    //

	    backToTopBtn.on('click', function() {

	      $.fn.fullpage.moveTo('Hangover-Science');

	    }); 


	  }; 

	}); 

})(); 



$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('product', theme.Product);
  sections.register('featuredProducts', theme.FeaturedProducts);
  sections.register('header', theme.Header);
  
  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Target tables to make them scrollable
  var tableSelectors = '.rte table';

  slate.rte.wrapTable({
    $tables: $(tableSelectors),
    tableWrapperClass: 'rte__table-wrapper',
  });

  // Target iframes to make them responsive
  var iframeSelectors =
    '.rte iframe[src*="youtube.com/embed"],' +
    '.rte iframe[src*="player.vimeo"]';

  slate.rte.wrapIframe({
    $iframes: $(iframeSelectors),
    iframeWrapperClass: 'rte__video-wrapper'
  });

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }


  //
  // Global Theme Behaviors 
  //
  theme.initCache = function() {
    theme.cache = {
      $window                 : $(window),
      $html                   : $('html'),
      $body                   : $('body')
    };
  };


  theme.afterCartLoad = function() {
    theme.cache.$body.on('ajaxCart.afterCartLoad', function(evt, cart) {
      theme.Header.openCart(); 
    });

  };


  theme.cartInit = function() {
    if (!slate.cart.cookiesEnabled()) {
      theme.cache.$body.addClass('cart--no-cookies');
    }

     ajaxCart.init({
        cartContainer: '#CartContainer',
        addToCartSelector: '[data-add-to-cart]',
        moneyFormat: theme.strings.moneyFormat
    });
     
  };


   theme.initPlugins = function() {
    //Configuration for lazySizes plugin to lazyload images 
    window.lazySizesConfig = window.lazySizesConfig || {}; 
    window.lazySizesConfig.throttleDelay = 200; 
    window.lazySizesConfig.init = true;
    window.lazySizesConfig.addClasses = true;
    window.lazySizesConfig.loadMode = 1; 
  }; 

  theme.init = function() {
    theme.initCache();
    theme.cartInit();
    theme.afterCartLoad(); 
  };

  theme.init(); 

  
});
