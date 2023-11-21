const request = require('supertest');
const app = require('./server'); // Adjust the path as necessary

var UID; 

describe('/get/messageToken endpoint', () => {
  /**
   * Test: Retrieve message token with valid DID
   * Input: A valid dietitian ID
   * Expected status code: 200
   * Expected behavior: Retrieve a message token corresponding to the given DID
   * Expected output: A message token in the response body
   */
  test('Retrieve message token with valid DID', async () => {
    const validDID = '1'; // Replace with an actual valid DID
    const res = await request(app).get(`/get/messageToken/${validDID}`);
    expect(res.status).toStrictEqual(200);
  });

  /**
   * Test: Attempt to retrieve message token with invalid DID
   * Input: An invalid dietitian ID
   * Expected status code: 404
   * Expected behavior: No message token is found for the invalid DID
   * Expected output: An error message in the response body
   */
  test('Attempt to retrieve message token with invalid DID', async () => {
    const invalidDID = '132'; // An invalid DID example
    const res = await request(app).get(`/get/messageToken/${invalidDID}`);
    expect(res.status).toStrictEqual(404);
  });

  /**
   * Test: Attempt to retrieve message token without providing a DID
   * Input: No DID provided in the request
   * Expected status code: 404
   * Expected behavior: Endpoint not found due to missing DID
   * Expected output: An error message indicating missing DID or invalid request
   */
  test('Attempt to retrieve message token without DID', async () => {
    const res = await request(app).get(`/get/messageToken/`);
    expect(res.status).toStrictEqual(404);
  });
});


//Interface GET https://20.104.197.24:443/get/users
describe('GET USER request', () => {
  //Input: both Email and Token passed, email is valid, unique and exists in the database 
  // Expected status code: 200
  //Expected behaviour: Message Token for the user with that email is updated, and get all //information for the user with that email
  //Expected output: UID, FirstName, LastName, Email, ProfileURL
  test("Valid user", async()=>{
    const email="test@gmail.com" //this email should exist in db
    const Token="fakoehfnjildhnfljhasfjsfksjf"
    const url= "/get/users?p1=" + email + "&p2=" + Token
    const res= await request(app).get(url)
    const responseObject = {
        FirstName: test,
        LastName: test,
        Email: "test@gmail.com",
        ProfileURL: "testing",
      }
    expect(res.status).toStrictEqual(200)
    expect(res.body.FirstName).toEqual(responseObject.FirstName)
    expect(res.body.LastName).toEqual(responseObject.LastName)
  })
  
  //Input: both Email and Token passed, email doesn’t exist in the database 
  // Expected status code: 500
  //Expected behaviour: No database column is changed
  //Expected output: None
  test("Email Not in DB", async()=>{
    const email="invalidtest@gmail.com" //this email should not exist in db
    const Token="fakoehfnjildhnfljhasfjsfksjf"
    const url= "/get/users?p1=" + email + "&p2=" + Token
    const res= await request(app).get(url)
    const responseObject = {}
    expect(res.status).toStrictEqual(500)
    expect(res.body).toEqual(responseObject)
  })
  
  //Input: either email or token is not passed, or both
  // Expected status code: 500
  //Expected behaviour: No database column is changed
  //Expected output: None
  test("Missing input", async()=>{
    const email="" 
    const Token=""
    const url= "/get/users?p1=" + email + "&p2=" + Token
    const res= await request(app).get(url)
    const responseObject = { }
    expect(res.status).toStrictEqual(500)
    expect(res.body).toEqual(responseObject)
  
  
  })
})

//Interface GET https://20.104.197.24:443/add/users
describe('/add/users endpoint', () => {
  /**
   * Test: Add a user with valid data
   * Input: Valid user data in the request body
   * Expected status code: 200
   * Expected behavior: User is added to the database, and UID is returned in the response body
   * Expected output: UID in the response body
   */
  test('Add user with valid data', async () => {
    const userData = {
      p1: 'John',
      p2: 'Doe',
      p3: 'john.doe@example.com',
      p4: 'https://example.com/profile.jpg',
      p5: 'someToken'
    };
    const expectedUID=38
    const res = await request(app).post('/add/users').send(userData);
    expect(res.status).toStrictEqual(200);
    //expect(res.body.UID).toEqual(expectedUID);
    UID=res.body.UID
  });

  /**
   * Test: Attempt to add a user with missing data
   * Input: Incomplete user data in the request body
   * Expected status code: 500
   * Expected behavior: User is not added to the database, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to add user with missing data', async () => {
    const incompleteUserData = {
      p1: 'John',
      p2: 'Doe',
      p3: 'john.doe@example.com',
      // Missing p4 and p5
    };

    const res = await request(app).post('/add/users').send(incompleteUserData);
    expect(res.status).toStrictEqual(500);
  });

  /**
   * Test: Attempt to add a user with invalid data
   * Input: Invalid user data in the request body
   * Expected status code: 500
   * Expected behavior: User is not added to the database, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to add user with invalid data', async () => {
    const invalidUserData = {
      p1: 'John',
      p2: 123, // Invalid data type for LastName
      p3: 'john.doe@example.com',
      p4: 'https://example.com/profile.jpg',
      p5: 'someToken'
    };

    const res = await request(app).post('/add/users').send(invalidUserData);
    expect(res.status).toStrictEqual(500);
  });
});

describe('/update/users endpoint', () => {
  /**
   * Test: Update user with valid data
   * Input: Valid UID and updated user data in the query parameters
   * Expected status code: 200
   * Expected behavior: User with the specified UID is updated in the database
   * Expected output: 'Success update user' in the response body
   */
  test('Update user with valid data', async () => {
    const validUID = 123; // Replace with an actual valid UID
    const updatedUserData = {
      p2: 'UpdatedFirstName',
      p3: 'UpdatedLastName',
      p4: 'updated.email@example.com',
      p5: 'https://example.com/updated-profile.jpg'
    };

    const res = await request(app)
      .get(`/update/users?p1=${UID}&p2=${updatedUserData.p2}&p3=${updatedUserData.p3}&p4=${updatedUserData.p4}&p5=${updatedUserData.p5}`);
    
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('Success update user');
  });

  /**
   * Test: Attempt to update user with invalid UID
   * Input: Invalid UID in the query parameters
   * Expected status code: 500 (or appropriate error status code)
   * Expected behavior: User is not updated, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to update user with invalid UID', async () => {
    const invalidUID = 'invalid'; // An invalid UID example
    const res = await request(app).get(`/update/users?p1=${invalidUID}`);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for invalid UID
  });

  /**
   * Test: Attempt to update user without providing a UID
   * Input: No UID provided in the query parameters
   * Expected status code: 500 (or appropriate error status code)
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to update user without UID', async () => {
    const res = await request(app).get('/update/users');
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 404 for missing UID
  });
});

describe('/get/items endpoint', () => {
  /**
   * Test: Get items for a user with valid UID
   * Input: Valid UID in the query parameters
   * Expected status code: 200
   * Expected behavior: Retrieve a list of items for the specified user from the database
   * Expected output: An array of items in the response body
   */
  test('Get items for user with valid UID', async () => {
    const validUID = 123; // Replace with an actual valid UID
    const res = await request(app).get(`/get/items?p1=${UID}`);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  /**
   * Test: Attempt to get items for a user with invalid UID
   * Input: Invalid UID in the query parameters
   * Expected status code: 500 (or appropriate error status code)
   * Expected behavior: No items are retrieved, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to get items for user with invalid UID', async () => {
    const invalidUID = 'invalid'; // An invalid UID example
    const res = await request(app).get(`/get/items?p1=${invalidUID}`);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for invalid UID
    expect(res.body).toHaveProperty('error');
  });

  /**
   * Test: Attempt to get items without providing a UID
   * Input: No UID provided in the query parameters
   * Expected status code: 404 (or appropriate error status code)
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to get items without UID', async () => {
    const res = await request(app).get('/get/items');
    expect(res.status).toStrictEqual(404); // Assuming the route returns a 404 for missing UID
  });
});

describe('/add/items endpoint', () => {
  /**
   * Test: Add items with valid data
   * Input: Valid user ID, UPCs, ExpireDates, and ItemCounts in the request body
   * Expected status code: 200
   * Expected behavior: Items are added to the database, and a success message is returned in the response body
   * Expected output: { message: 'SUCCESS ADDED ITEMS' } in the response body
   */
  test('Add items with valid data', async () => {
    const validData = {
      p1: UID, // Replace with an actual valid UID
      p2: ['068700115004', '068700115004'], // Replace with actual UPCs
      p3: ['2023-12-31', '2024-01-15'], // Replace with actual ExpireDates
      p4: [2, 5] // Replace with actual ItemCounts
    };

    const res = await request(app).post('/add/items').send(validData);
    expect(res.status).toStrictEqual(200);
    expect(res.body).toEqual({ message: 'SUCCESS ADDED ITEMS' });
  });

  /**
   * Test: Attempt to add items with inconsistent array lengths
   * Input: Inconsistent array lengths in the request body
   * Expected status code: 400
   * Expected behavior: Items are not added to the database, and an error message is returned in the response body
   * Expected output: 'Array lengths must match.' in the response body
   */
  test('Attempt to add items with inconsistent array lengths', async () => {
    const inconsistentData = {
      p1: UID,
      p2: ['123456', '789012'],
      p3: ['2023-12-31'], // Different length from p2 and p4
      p4: [2, 5]
    };

    const res = await request(app).post('/add/items').send(inconsistentData);
    expect(res.status).toStrictEqual(400);
    expect(res.text).toBe('Array lengths must match.');
  });

  /**
   * Test: Attempt to add items with invalid data
   * Input: Invalid data in the request body
   * Expected status code: 500
   * Expected behavior: Items are not added to the database, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to add items with invalid data', async () => {
    const invalidData = {
      p1: 'invalid', // Invalid UID
      p2: ['123456', '789012'],
      p3: ['2023-12-31', '2024-01-15'],
      p4: [2, 'invalid'] // Invalid ItemCount
    };

    const res = await request(app).post('/add/items').send(invalidData);
    expect(res.status).toStrictEqual(500);
    expect(res.text).toBe('Internal Server Error');
  });
});


describe('/add/items_man endpoint', () => {
  /**
   * Test: Add items manually with valid data
   * Input: Valid user ID, UPC, ExpireDate, ItemCount, and ItemName in the request body
   * Expected status code: 200
   * Expected behavior: Items are added to the database, and a success message is returned in the response body
   * Expected output: 'SUCCESS ADDED ITEMS MANUAL' in the response body
   */
  test('Add items manually with valid data', async () => {
    const validData = {
      p1: UID, // Replace with an actual valid UID
      p2: -1,
      p3: ['2023-12-31', '2024-01-15'],
      p4: [2, 5],
      p5: ['Item1', 'Item2']
    };

    const res = await request(app).post('/add/items_man').send(validData);
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('SUCCESS ADDED ITEMS MANUAL');
  });

  /**
   * Test: Attempt to add items manually with inconsistent array lengths
   * Input: Inconsistent array lengths in the request body
   * Expected status code: 400
   * Expected behavior: Items are not added to the database, and an error message is returned in the response body
   * Expected output: 'Arrays should have the same length' in the response body
   */
  test('Attempt to add items manually with inconsistent array lengths', async () => {
    const inconsistentData = {
      p1: UID,
      p2: -1,
      p3: ['2023-12-31'],
      p4: [2, 5],
      p5: ['Item1', 'Item2']
    };

    const res = await request(app).post('/add/items_man').send(inconsistentData);
    expect(res.status).toStrictEqual(400);
    expect(res.text).toBe('Arrays should have the same length');
  });

  /**
   * Test: Attempt to add items manually with invalid data
   * Input: Invalid data in the request body
   * Expected status code: 500
   * Expected behavior: Items are not added to the database, and an error message is returned in the response body
   * Expected output: An error message in the response body
   */
  test('Attempt to add items manually with invalid data', async () => {
    const invalidData = {
      p1: 'invalid', // Invalid UID
      p2: -1,
      p3: ['2023-12-31', '2024-01-15'],
      p4: [2, 'invalid'], // Invalid ItemCount
      p5: ['Item1', 'Item2']
    };

    const res = await request(app).post('/add/items_man').send(invalidData);
    expect(res.status).toStrictEqual(500);
    expect(res.text).toBe('Internal Server Error');
  });
});


describe('/delete/items endpoint', () => {
  /**
   * Test: Delete items with valid UID and ItemID
   * Input: Valid UID and ItemID in the request body
   * Expected status code: 200
   * Expected behavior: Items with the specified UID and ItemID are deleted from the database
   * Expected output: 'DELETED ITEM' in the response body
   */
  test('Delete items with valid UID and ItemID', async () => {
    const validData = {
      p1: UID, // Replace with an actual valid UID
      p2: [1, 2] // Replace with actual valid ItemIDs
    };

    const res = await request(app).post('/delete/items').send(validData);
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('DELETED ITEM');
  });

  /**
   * Test: Attempt to delete items with invalid UID
   * Input: Invalid UID in the request body
   * Expected status code: 200 (assuming the route handles invalid UID cases gracefully)
   * Expected behavior: No items are deleted, and a message indicating no rows were deleted is returned
   * Expected output: 'No rows were deleted. Check the values in your DELETE query.' in the response body
   */
  test('Attempt to delete items with invalid UID', async () => {
    const invalidData = {
      p1: 'invalid', // An invalid UID example
      p2: [1, 2] // Replace with actual valid ItemIDs
    };

    const res = await request(app).post('/delete/items').send(invalidData);
    expect(res.status).toStrictEqual(200); // Assuming the route handles invalid UID cases gracefully
    expect(res.text).toBe('No rows were deleted. Check the values in your DELETE query.');
  });

  /**
   * Test: Attempt to delete items without providing UID
   * Input: No UID provided in the request body
   * Expected status code: 500
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to delete items without UID', async () => {
    const invalidData = {
      p2: [1, 2] // Replace with actual valid ItemIDs
    };

    const res = await request(app).post('/delete/items').send(invalidData);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for missing UID
  });

  /**
   * Test: Attempt to delete items without providing ItemID
   * Input: No ItemID provided in the request body
   * Expected status code: 500
   * Expected behavior: Endpoint not found due to missing ItemID
   * Expected output: An error message indicating missing ItemID or invalid request
   */
  test('Attempt to delete items without ItemID', async () => {
    const invalidData = {
      p1: UID // Replace with an actual valid UID
    };

    const res = await request(app).post('/delete/items').send(invalidData);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for missing ItemID
  });
});

describe('/update/items endpoint', () => {
  /**
   * Test: Update items with valid UID, ItemID, UPC, ExpireDate, and ItemCount
   * Input: Valid data in the request body
   * Expected status code: 200
   * Expected behavior: Items with the specified UID, ItemID, UPC are updated in the database
   * Expected output: 'SUCCESS Updated items' in the response body
   */
  test('Update items with valid data', async () => {
    const validData = {
      p1: UID, // Replace with an actual valid UID
      p2: [1, 2], // Replace with actual valid ItemIDs
      p3: [123456, 789012], // Replace with actual valid UPCs
      p4: ['2023-12-01', '2023-12-15'], // Replace with actual valid ExpireDates
      p5: [5, 10] // Replace with actual valid ItemCounts
    };

    const res = await request(app).post('/update/items').send(validData);
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('SUCCESS Updated items');
  });

  /**
   * Test: Attempt to update items with mismatched array lengths
   * Input: Arrays with different lengths in the request body
   * Expected status code: 400
   * Expected behavior: Endpoint returns an error message indicating array length mismatch
   * Expected output: Error message in the response body
   */
  test('Attempt to update items with mismatched array lengths', async () => {
    const invalidData = {
      p1: UID, // Replace with an actual valid UID
      p2: [1, 2], // Replace with actual valid ItemIDs
      p3: [123456, 789012], // Replace with actual valid UPCs
      p4: ['2023-12-01'], // Missing one ExpireDate
      p5: [5, 10] // Replace with actual valid ItemCounts
    };

    const res = await request(app).post('/update/items').send(invalidData);
    expect(res.status).toStrictEqual(400);
    expect(res.text).toBe('Arrays should have the same length');
  });

  /**
   * Test: Attempt to update items without providing UID
   * Input: No UID provided in the request body
   * Expected status code: 500
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to update items without UID', async () => {
    const invalidData = {
      p2: [1, 2], // Replace with actual valid ItemIDs
      p3: [123456, 789012], // Replace with actual valid UPCs
      p4: ['2023-12-01', '2023-12-15'], // Replace with actual valid ExpireDates
      p5: [5, 10] // Replace with actual valid ItemCounts
    };

    const res = await request(app).post('/update/items').send(invalidData);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for missing UID
  });
});

const request = require('supertest');
const app = require('./server'); // Adjust the path as necessary

describe('/add/pref endpoint', () => {
  /**
   * Test: Add preferences with valid UID and preferences
   * Input: Valid data in the request body
   * Expected status code: 200
   * Expected behavior: Preferences with the specified UID are added to the database
   * Expected output: 'SUCCESS ADDED Pref' in the response body
   */
  test('Add preferences with valid data', async () => {
    const validData = {
      p1: UID, // Replace with an actual valid UID
      p2: ['Vegan'] // Replace with actual valid preferences
    };

    const res = await request(app).post('/add/pref').send(validData);
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('SUCCESS ADDED Pref');
  });

  /**
   * Test: Attempt to add preferences without providing UID
   * Input: No UID provided in the request body
   * Expected status code: 500
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to add preferences without UID', async () => {
    const invalidData = {
      p2: ['Preference1', 'Preference2'] // Replace with actual valid preferences
    };

    const res = await request(app).post('/add/pref').send(invalidData);
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 500 for missing UID
  });

  /**
   * Test: Attempt to add preferences with an empty array
   * Input: Empty array provided for preferences in the request body
   * Expected status code: 200 (or appropriate status code for handling empty preferences array)
   * Expected behavior: No preferences are added, and a message indicating empty preferences is returned
   * Expected output: 'No preferences provided' in the response body
   */
  test('Attempt to add preferences with an empty array', async () => {
    const emptyData = {
      p1: UID, // Replace with an actual valid UID
      p2: [] // Empty array for preferences
    };

    const res = await request(app).post('/add/pref').send(emptyData);
    expect(res.status).toStrictEqual(200); // Assuming the route handles empty preferences array gracefully
    expect(res.text).toBe('No preferences provided');
  });
});



//Interface GET https://20.104.197.24:443/delete/users
describe('/delete/users endpoint', () => {
  /**
   * Test: Delete a user with a valid UID
   * Input: Valid UID in the query parameters
   * Expected status code: 200
   * Expected behavior: User with the specified UID is deleted from the database
   * Expected output: 'DELETED USER' in the response body
   */
  test('Delete user with valid UID', async () => {
    const res = await request(app).get('/delete/users?p1=' +UID);
    expect(res.status).toStrictEqual(200);
    expect(res.text).toBe('DELETED USER');
  });

  /**
   * Test: Attempt to delete a user with an invalid UID
   * Input: Invalid UID in the query parameters
   * Expected status code: 200 (assuming the route handles invalid UID cases gracefully)
   * Expected behavior: No user is deleted, and a message indicating no rows were deleted is returned
   * Expected output: 'No rows were deleted. Check the values in your DELETE query.' in the response body
   */
  test('Attempt to delete user with invalid UID', async () => {
    const invalidUID = 'invalid'; // An invalid UID example
    const res = await request(app).get('/delete/users?p1=' +invalidUID);
    expect(res.status).toStrictEqual(200); // Assuming the route handles invalid UID cases gracefully
    expect(res.text).toBe('No rows were deleted. Check the values in your DELETE query.');
  });

  /**
   * Test: Attempt to delete a user without providing a UID
   * Input: No UID provided in the query parameters
   * Expected status code: 500
   * Expected behavior: Endpoint not found due to missing UID
   * Expected output: An error message indicating missing UID or invalid request
   */
  test('Attempt to delete user without UID', async () => {
    const res = await request(app).get('/delete/users');
    expect(res.status).toStrictEqual(500); // Assuming the route returns a 404 for missing UID
  });
});