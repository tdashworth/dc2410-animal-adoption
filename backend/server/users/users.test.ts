import chai from 'chai';
import mongoose from 'mongoose';
import Users from './users.model';
import { UserType, IUser } from 'dc2410-coursework-common';
const expect = chai.expect;

describe('Users library', function() {
  this.timeout(5000);

  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/dc2410-coursework-test', {
      useNewUrlParser: true,
      useFindAndModify: false,
    });
  });

  beforeEach(async () => {
    return Users.deleteAll();
  });

  after(async () => {
    return mongoose.disconnect();
  });

  it(
    'users.create() can create a user given data with username, passwordHash and' +
      ' displayName properties. It returns a copy of the message with matching username,' +
      ' passwordHash and displayName properties and an id property.',
    async () => {
      const user = {
        username: 'alice',
        passwordHash: 'Password1',
        displayName: 'Alice',
      };

      const result = await Users.create(user);

      expect(result).to.be.an('object');
      if (result == null) throw new Error('Result return null');
      expect(result).to.have.property('username');
      expect(result.username).to.equal(user.username);
      expect(result).to.have.property('passwordHash');
      expect(result.passwordHash).to.not.equal(user.passwordHash);
      expect(result).to.have.property('displayName');
      expect(result.displayName).to.equal(user.displayName);
      expect(result).to.have.property('type');
      expect(result.type).to.equal(UserType.External);
      expect(result).to.have.property('_id');
    },
  );

  it(
    'users.get() reads a single user created by users.create() ' +
      'using the id property returned by the latter.',
    async () => {
      const user = {
        username: 'alice',
        passwordHash: 'Password1',
        displayName: 'Alice',
      };
      const createResult = await Users.create(user);
      if (createResult == null) throw new Error('Result return null');

      const readResult = await Users.get(createResult.id);

      if (readResult == null) throw new Error('Result return null');
      expect(readResult).to.have.property('username');
      expect(readResult.username).to.equal(user.username);
      expect(readResult).to.have.property('passwordHash');
      expect(readResult.passwordHash).to.not.equal(user.passwordHash);
      expect(readResult).to.have.property('displayName');
      expect(readResult.displayName).to.equal(user.displayName);
      expect(readResult).to.have.property('type');
      expect(readResult.type).to.equal(UserType.External);
    },
  );

  it(
    'users.create() fails to create users given data which is missing ' +
      'username and/or passwordHash properties.',
    () => {
      const emptyMessage = {};
      const usernameMessage = { username: 'carol' };
      const passwordMessage = { passwordHash: 'Password10' };
      const testCreateFail = async (user: any) => {
        await Users.create(user).catch((err) =>
          expect(err.message).to.contain('Users validation failed:'),
        );
      };

      return Promise.all([
        testCreateFail(emptyMessage),
        testCreateFail(usernameMessage),
        testCreateFail(passwordMessage),
      ]);
    },
  );

  it(
    'users.create() fails to create users given username and/or passwordHash ' +
      'properties which are not convertible to string.',
    async () => {
      const testCreateFail = async (user: any) => {
        await Users.create(user).catch((err) =>
          expect(err.message).to.contain('Users validation failed:'),
        );
      };

      await testCreateFail({
        username: { prop: 'val' },
        passwordHash: 'Password10',
        displayName: 'Tom',
      });
      await testCreateFail({
        username: 'carol',
        passwordHash: { prop: 'val' },
        displayName: 'Carol',
      });
      await testCreateFail({
        username: 'Carol',
        passwordHash: 'Password10',
        displayName: { prop: 'val' },
      });

      const result = await Users.listAll();
      expect(result).to.be.an('array');
      expect(result.length).to.equal(0);
    },
  );

  it(
    'users.create() fails given data with more properties than username, ' +
      'passwordHash and displayName',
    async () => {
      const newUser = {
        username: 'carol',
        passwordHash: 'password5',
        displayName: 'Carol',
        moreData: true,
      };

      try {
        await Users.create(newUser);
      } catch (err) {
        // tslint:disable-next-line:max-line-length
        expect(err.message).to.equal(
          'Field `moreData` is not in schema and strict mode is set to throw.',
        );
      }
    },
  );

  it('users.get() returns a null result given a non-existent ID', async () => {
    const user = {
      username: 'bob',
      passwordHash: 'Password2',
      displayName: 'Bob',
    };
    await Users.create(user);
    const fakeId = '000000000000000000000000';

    const readResult = await Users.get(fakeId);

    expect(readResult).to.equal(null);
  });

  /* 1.5 Security */
  it(
    'users passed to users.create() are sanitized to remove dangerous ' +
      'HTML before being stored',
    async () => {
      const dangerousHTML = '<script>maliciousCode()</script>';
      const testUser = {
        username: 'bob',
        passwordHash: 'Password2',
        displayName: 'Bob',
      };

      const testCreateSanitized = async (user: IUser) => {
        const createResult = await Users.create(user);
        if (createResult == null) throw new Error('Result return null');
        expect(createResult.username).to.contain(testUser.username);
        expect(createResult.passwordHash).to.not.equal(testUser.passwordHash);
        expect(createResult.displayName).to.equal(testUser.displayName);
        expect(createResult).to.have.property('type');
        expect(createResult.type).to.equal(UserType.External);
      };

      await testCreateSanitized({
        username: `${testUser.username}_1${dangerousHTML}`,
        passwordHash: testUser.passwordHash,
        displayName: testUser.displayName,
      });
      await testCreateSanitized({
        username: `${testUser.username}_2`,
        passwordHash: testUser.passwordHash + dangerousHTML,
        displayName: testUser.displayName,
      });
      await testCreateSanitized({
        username: `${testUser.username}_3`,
        passwordHash: testUser.passwordHash,
        displayName: testUser.displayName + dangerousHTML,
      });
    },
  );

  it(
    'users.get() fails if given data which is not convertible to an ' + 'ID',
    async () => {
      const user = {
        username: 'alice',
        passwordHash: 'Password1',
        displayName: 'Alice',
      };
      await Users.create(user);

      const invalidId = ({ $ne: '' } as unknown) as string;
      const result = await Users.get(invalidId);
      expect(result).to.not.be.an('object');
    },
  );
});
