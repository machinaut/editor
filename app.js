$(function() {
  var Word = Backbone.Model.extend({
    defaults: function() {
      return {
        text: '',
        type: 'plain',
        visible: true,
        order: Words.nextOrder()
      };
    },
    inserta: function(k) {
      this.set({ text: this.get('text')+String.fromCharCode(k) });
    }
  });

  var WordList = Backbone.Collection.extend({
    model: Word,
    localStorage: new Backbone.LocalStorage('ɛdɪt'),
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },
    comparator: function(word) {
      return word.get('order');
    },
    insert: function(e) {
      if (e.which !== 0 && e.charCode !== 0) {
        this.last().inserta(e.keyCode|e.charCode);
      }
    },
  });

  var Words = new WordList;

  var WordView = Backbone.View.extend({
    tagName: 'span',
    initialize: function() {
      this.model.on('change', this.render, this);
      this.model.on('destroy', this.remove, this);
    },
    render: function() {
      this.className = this.model.get('type');
      $(this.el).html(this.model.get('text')+' ');
      return this;
    },
  });

  var DocView = Backbone.View.extend({
    el: $('#app'),
    initialize: function() {
      Words.on('add', this.addOne, this);
      Words.on('reset', this.addAll, this);
      Words.fetch();
    },
    addOne: function(word) {
      var view = new WordView({model: word});
      this.$('#line').append(view.render().el);
    },
    addAll: function() {
      Words.each(this.addOne);
    },
    insert: function(e) {
      Words.insert(e);
    },
  });

  var Doc = new DocView;

  $('body').keypress(function(e) {
      Doc.insert(e);
  });

  // TODO: remove crap.
  var words = [{text:'asdf'},{text:'yarg'},{text:'sdlfkj'}];
  Words.reset(words);
});
