const common = require('./../lib/common')

test('The fetch fails with an error due to missing the parameter', async () => {
    const data = await common.getGuidFromName();
    expect(data).toBe('Name result undefined or not passed');
});

test('The judge command should not be allowed for a normal user', () => {
    const data = common.isUserAllowed('judge', 1);
    expect(data).toStrictEqual({errcode:1,message:"You are not authorized to perform this command!"});
});

test('The judge command should be allowed for an admin', () => {
    const data = common.isUserAllowed('judge', 3);
    expect(data).toStrictEqual({errcode: 0});
});
