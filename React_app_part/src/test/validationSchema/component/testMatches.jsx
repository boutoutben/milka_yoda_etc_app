import set from 'lodash/set';

function testMatches(fieldName, validValues, invalidValues, schema, baseData, expectedErrorMessage, confirm = null) {
    test.each(validValues.map(value => ({ value })))(
        `✅ should pass for valid ${fieldName}: %p`,
        async ({ value }) => {
            const data = {
                ...baseData,
            };
            set(data, fieldName, value)
            if(confirm) {
                set(data, confirm, value)
            }
            await expect(schema.validate(data)).resolves.toEqual(data);
        }
    );

    test.each(invalidValues)(
        `❌ should fail for invalid ${fieldName}: $value ($reason)`,
        async ({ value }) => {
            
            const data = {
                ...baseData,
            };
            set(data, fieldName, value)
            if(confirm) {
                set(data, confirm, value)
            }
            await expect(schema.validate(data)).rejects.toThrow(expectedErrorMessage);
        }
    );
}

export default testMatches