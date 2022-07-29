describe('Support for parallel execution', function() {
  let env;

  beforeEach(function() {
    env = new jasmineUnderTest.Env();
  });

  afterEach(function() {
    env.cleanup_();
  });

  it('removes specs and suites from previous batches', async function() {
    env.describe('a suite', function() {
      env.it('a spec', function() {});
    });
    env.it('a spec', function() {});

    await env.execute();
    env.parallelReset();

    env.describe('a suite in a new batch', function() {
      env.it('a spec in a new batch', function() {});
    });
    const reporter = jasmine.createSpyObj('reporter', [
      'suiteDone',
      'specDone'
    ]);
    env.addReporter(reporter);

    await env.execute();

    expect(reporter.suiteDone).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        fullName: 'a suite in a new batch'
      })
    );
    expect(reporter.specDone).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        fullName: 'a suite in a new batch a spec in a new batch'
      })
    );
  });

  it('preserves top-level before and after fns from previous batches', async function() {
    const beforeAll = jasmine.createSpy('beforeAll');
    const beforeEach = jasmine.createSpy('beforeEach');
    const afterEach = jasmine.createSpy('afterEach');
    const afterAll = jasmine.createSpy('afterAll');
    env.beforeAll(beforeAll);
    env.beforeEach(beforeEach);
    env.afterEach(afterEach);
    env.afterAll(afterAll);

    env.parallelReset();
    env.it('a spec', function() {});
    await env.execute();

    expect(beforeAll).toHaveBeenCalled();
    expect(beforeEach).toHaveBeenCalled();
    expect(afterEach).toHaveBeenCalled();
    expect(afterAll).toHaveBeenCalled();
  });

  it('does not remember focused runables from previous batches', async function() {
    env.fit('a focused spec', function() {});
    env.parallelReset();
    env.it('a spec', function() {});
    const reporter = jasmine.createSpyObj('reporter', [
      'specDone',
      'jasmineDone'
    ]);
    env.addReporter(reporter);
    await env.execute();

    expect(reporter.specDone).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        fullName: 'a spec',
        status: 'passed'
      })
    );
    expect(reporter.jasmineDone).toHaveBeenCalledWith(
      jasmine.objectContaining({ overallStatus: 'passed' })
    );
  });

  it('does not remember failures from previous batches', async function() {
    env.it('a failing spec', function() {
      env.expect(true).toBe(false);
    });
    await env.execute();
    env.parallelReset();
    env.it('a spec', function() {});
    const reporter = jasmine.createSpyObj('reporter', [
      'specDone',
      'jasmineDone'
    ]);
    env.addReporter(reporter);
    await env.execute();

    expect(reporter.jasmineDone).toHaveBeenCalledWith(
      jasmine.objectContaining({ overallStatus: 'passed' })
    );
  });
});
