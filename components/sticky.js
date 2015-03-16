var React = require('react'),
  raf = require('raf');

var Sticky = React.createClass({

  reset: function() {
    var html = document.documentElement, body = document.body;
    var node = this.getDOMNode();

    var windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;
    var classes = node.className;
    node.className = '';
    this.elementOffset = node.getBoundingClientRect().top + windowOffset;
    node.className = classes;
  },  
  
  tick: function() {
    if (!this.unmounting) {
      raf(this.tick);
    }

    if (this.resizing) {
      this.resizing = false;
      this.reset();
    }

    var wasSticky = this.state.sticky, sticky;
    if (this.scrolling) {
      this.scrolling = false;

      if (pageYOffset > this.elementOffset) {
        sticky = true;        
      } else {
        sticky = false;
      }

      if (wasSticky !== sticky) {
        this.setState({ sticky: sticky });

        if (typeof this.props.onStickyChange === 'function') {
          this.props.onStickyChange(sticky);
        }
      }
    }
  },  

  handleResize: function() {
    this.resizing = true;
  },

  handleScroll: function() {
    this.scrolling = true;
  },

  getInitialState: function() {
    return { sticky: false }; 
  },

  componentDidMount: function() {
    this.reset();
    this.tick(); 
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.unmounting = true;
  },

  render: function() {
    return React.createElement('div', {
      className: this.state.sticky ? (this.props.stickyClassName || 'sticky') : ''
    }, this.props.children);
  }
});

module.exports = Sticky;
