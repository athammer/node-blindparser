// test.js
var vows = require('vows');
var assert = require('assert');

var parser = require('../lib/feed.js');

var sampleFeeds = require('./sampleFeeds');

vows.describe('bindparser').addBatch({
  'rss tests': {
    topic: function() {
      parser.parseURL('http://rss.cnn.com/rss/cnn_topstories.rss', {}, this.callback);
    },
    'response is not null': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    },
    'response is properly formatted': function(err, docs) {
      assert.equal(docs.type, 'rss');
      assert.isObject(docs.metadata);
      assert.isString(docs.metadata.title);
      assert.isString(docs.metadata.desc);
      assert.isString(docs.metadata.url);
      assert.isString(docs.metadata.lastBuildDate);
      assert.isString(docs.metadata.update);
      assert.isString(docs.metadata.ttl);
      assert.isArray(docs.metadata.image);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      var item = docs.items[0];
      assert.isString(item.title);
      assert.isString(item.desc);
      assert.isArray(item.category);
      assert.isString(item.link);
      assert.isNumber(item.date);
      assert.isObject(item.guid);
      assert.isString(item.guid.link);
    }
  },
  'atom tests': {
    topic: function() {
      parser.parseURL('http://www.blogger.com/feeds/10861780/posts/default', {}, this.callback);
    },
    'response is not null': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    },
    'response is properly formatted': function(err, docs) {
      assert.equal(docs.type, 'atom');
      assert.isObject(docs.metadata);
      assert.isString(docs.metadata.title);
      assert.isString(docs.metadata.desc);
      assert.isString(docs.metadata.url);
      assert.isString(docs.metadata.id);
      assert.isString(docs.metadata.update);
      assert.isObject(docs.metadata.author);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      var item = docs.items[0];
      assert.isString(item.id);
      assert.isString(item.title);
      assert.isString(item.desc);
      assert.isArray(item.category);
      assert.isString(item.link);
      assert.isNumber(item.date);
      assert.isNumber(item.updated);
      assert.isObject(item.media);
      assert.isObject(item.media.thumbnail);
    }
  },
  'additional atom tests': {
    topic: function() {
      parser.parseURL('http://code.visualstudio.com/feed.xml', {}, this.callback);
    },
    'response is not null': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    },
    'response is properly formatted': function(err, docs) {
      assert.equal(docs.type, 'atom');
      assert.isObject(docs.metadata);
      assert.isString(docs.metadata.title);
      assert.isString(docs.metadata.url);
      assert.isString(docs.metadata.id);
      assert.isString(docs.metadata.update);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      var item = docs.items[0];
      assert.isString(item.id);
      assert.isString(item.title);
      assert.isObject(item.desc);
      assert.isArray(item.category);
      assert.isString(item.link);
      assert.isNumber(item.updated);
    }
  },
  'feedburner tests': {
    topic: function() {
      parser.parseURL('http://feeds.feedburner.com/TechCrunch', this.callback);
    },
    'response is not null': function(err, docs) {
      assert.isNull(err);
      assert.isNotNull(docs);
    },
    'response is formatted as rss': function(err, docs) {
      assert.equal(docs.type, 'rss');
      assert.isObject(docs.metadata);
      assert.isArray(docs.items);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
    },
    'response contains images': function(err, docs) {
      assert.ok(docs.metadata.image);
    }
  },
  'oddities': {
    'empty xml': {
      topic: function() {
        parser.parseString('<?xml version="1.0" ecoding="UTF-8"?>', {}, this.callback);
      },
      'returns an error': function(err, docs) {
        assert.instanceOf(err, Error);
        assert.isUndefined(docs);
      },
    },
    'bad status code': {
      topic: function() {
        parser.parseURL('http://google.com/notafile', this.callback);
      },
      'returns an error': function(err, docs) {
        assert.instanceOf(err, Error);
        assert.isUndefined(docs);
      },
    },
    'non xml url': {
      topic: function() {
        parser.parseURL('http://google.com', {}, this.callback);
      },
      'returns an error': function(err, docs) {
        assert.instanceOf(err, Error);
        assert.isUndefined(docs);
      }
    }
  },
  'craigslist': {
    topic: function() {
      parser.parseURL('https://www.craigslist.org/about/best/all/index.rss', this.callback);
    },
    'response is formatted as rss': function(err, docs) {
      assert.equal(docs.type, 'rss');
      assert.isObject(docs.metadata);
      assert.isArray(docs.items);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
    },
    'response items have titles': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].title);
    },
    'response items have links': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].link);
    },
    'response items have desc': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].desc);
    },
    'response items have date': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].date);
    }
  },
  'cdata tests': {
    topic: function() {
      parser.parseURL('https://www.engage.hoganlovells.com/knowledgeservices/RSSAuth.action?kydt=2I8afWIM4kg%2FIbGC%2Fm2k8H26Pm6vJtg5rL21MOB7xjlEjnk3tUyvPH8IRqio7Qc5OzTQyo8Nus%2FdzoxprWhI6w%3D%3D&maxrecords=0&rqf=as&ful=1', this.callback);
    },
    'response is formatted as rss': function(err, docs) {
      assert.equal(docs.type, 'rss');
      assert.isObject(docs.metadata);
      assert.isArray(docs.items);
    },
    'response contains items': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
    },
    'response items have titles': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].title);
    },
    'response items have links': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].link);
    },
    'response items have desc': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].desc);
    },
    'response items have date': function(err, docs) {
      assert.isArray(docs.items);
      assert.ok(docs.items.length > 0);
      assert.isNotNull(docs.items[0].date);
    }
  },
  'parse string tests': {
    'atom test': {
      topic: function() {
        parser.parseString(sampleFeeds.atomFeed, this.callback);
      },
      'response is formatted correctly': function(err, docs) {
        console.log(sampleFeeds)
        assert.equal(docs.type, 'atom');
        assert.isObject(docs.metadata);
        assert.isString(docs.metadata.title);
        assert.isString(docs.metadata.desc);
        assert.isString(docs.metadata.url);
        assert.isString(docs.metadata.id);
        assert.isString(docs.metadata.update);
      },
      'entry is formatted correctly': function(err, docs) {
        assert.isArray(docs.entry);
        assert.ok(docs.entry.length > 0);
        var entry = docs.entry[0];
        assert.isString(entry.title);
        assert.isString(entry.link);
        assert.isString(entry.id);
        assert.isString(entry.updated);
        assert.isString(entry.summary);
        assert.isString(entry.logo);
        assert.isString(entry.icon);
      },
  
    },
    'mrss test': {
      topic: function() {
        parser.parseString(sampleFeeds.mrssFeed, this.callback);
      },
      'response is formatted correctly': function(err, docs) {
        assert.equal(docs.type, 'rss');
        assert.isObject(docs.metadata);
        assert.isString(docs.metadata.title);
        assert.isString(docs.metadata.desc);
        assert.isString(docs.metadata.link);
        assert.isArray(docs.metadata.image);
      },
      'items is formatted correctly': function(err, docs) {
        assert.isArray(docs.items);
        assert.ok(docs.items.length > 0);
        var item = docs.items[0];
        assert.isString(item.title);
        assert.isString(item.desc);
        assert.isString(item.link);
        assert.isObject(item.media.thumbnail);
        assert.isObject(item.media.title);
      }
  
    },
    'rss v1 test': {
      topic: function() {
        parser.parseString(sampleFeeds.rssV1Feed, this.callback);
      },
      'response is formatted correctly': function(err, docs) {
        assert.equal(docs.type, 'rss');
        assert.isObject(docs.metadata);
        assert.isString(docs.metadata.title);
        assert.isString(docs.metadata.desc);
        assert.isArray(docs.metadata.image);
        assert.isArray(docs.metadata.items);
      },
      'items is formatted correctly': function(err, docs) {
        assert.isArray(docs.item);
        assert.ok(docs.items.length > 0);
        var item = docs.items.item;
        assert.isString(item.title);
        assert.isString(item.desc);
        assert.isString(item.link);
      }
    },
    'rss v2 test': {
      topic: function() {
        parser.parseString(sampleFeeds.rssV2Feed, this.callback);
      },
      'response is formatted correctly': function(err, docs) {
        assert.equal(docs.type, 'rss');
        assert.isObject(docs.metadata);
        assert.isString(docs.metadata.title);
        assert.isString(docs.metadata.desc);
        assert.isString(docs.metadata.link);
        assert.isArray(docs.metadata.image);
      },
      'items is formatted correctly': function(err, docs) {
        assert.isArray(docs.items);
        assert.ok(docs.items.length > 0);
        var item = docs.items[0];
        assert.isString(item.title);
        assert.isString(item.desc);
        assert.isString(item.link);
        assert.isObject(item.enclosure)
      }
    },

  }



}).export(module);
