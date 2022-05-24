const app = require('../src/server'); // Link to your server file
const supertest = require('supertest')
const request = supertest(app);



describe("GET /contracts", () => {
  test('Access to /contracts without profile_id header', (done) => {
    request.get("/contracts")
    .expect(401)
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
  });

  test('Access to /contracts with profile_id header', (done) => {
    request.get("/contracts")
    .set('profile_id', '1')
    .expect(200)
    .expect((res) => {
      expect(Array.isArray(res.body)).toBe(true);
      expect(typeof res.body[0]).toBe('object')
      expect(typeof res.body[0].id).toBe('number')
      expect(isNaN(new Date(res.body[0].createdAt))).toBe(false)
      expect(res.body[0].status).not.toEqual('terminated')
    })
    .end((err, res) => {
      if (err) return done(err);
      return done();
    });
  })

});