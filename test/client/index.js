/**
 * index.js
 *
 * Tetsuya Chiba, Aug/15/2016
 */
var expect = chai.expect;
var assert = chai.assert;
describe('environment check', function () {
  it('is_Noode: false', function () {
    expect(_g.isNode).to.be.false;
  });
  it('apoMgr: object', function () {
    expect(typeof _g.apoMgr).equals('object');
  });
  it('Set: function', function () {
    expect(typeof _g.Set).equals('function');
  });
  it('_g.Set: function', function () {
    expect(typeof _g.Set).equals('function');
  });
});
describe('crud apo', function () {
  before(function () {
    var am = this.am = _g.apoMgr;
    var t = this.t = new Date(), p = this.p = new Date(), n = this.n = new Date();
    p.setDate(p.getDate() - 1);
    n.setDate(n.getDate() + 1);
    this.today = am.apoToMark({y: t.getFullYear(), m: t.getMonth() + 1, d: t.getDate()});
    this.past  = am.apoToMark({y: p.getFullYear(), m: p.getMonth() + 1, d: p.getDate()});
    this.next  = am.apoToMark({y: n.getFullYear(), m: n.getMonth() + 1, d: n.getDate()});
  });
  it('no apo today:', function () {
    expect(this.am.hasMark(this.today)).to.be.false;
  });
  it('no apo tomorrow:', function () {
    expect(this.am.hasMark(this.next)).to.be.false;
  });
  if (_g.testing) {
    it('set apo today:', function () {
      expect(this.am.setCalendar(this.today, this.today, false)).to.be.true;
    });
    it('set apo tomorrow:', function () {
      expect(this.am.setCalendar(this.next, this.next, false)).to.be.true;
    });
  }
});
// assert('', '');

