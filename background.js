const testData = {
  'Number': {
    'Integer': 12345,
    'Negative Integer': -12345,
    'Decimal': 12345.6789,
    'Negative Decimal': -12345.6789,
    'Hexadecimal': '0x1A3F',
    'Boundary Value': Number.MAX_SAFE_INTEGER,
    'Negative Boundary Value': Number.MIN_SAFE_INTEGER,
    'NaN': NaN,
    'Special Characters': 12345.6789,
    'Long': 1234567890123456789012345678901234567890 ,
    'Hindi': '१२३४५६७८९०',
    'Arabic': '١٢٣٤٥٦٧٨٩٠',
    'Chinese': '一二三四五六七八九〇',
    'Japanese': '一二三四五六七八九〇',
  'String': {
    'Simple': 'John Doe',
    'Special Characters': 'José María',
    'Long': 'Pneumonoultramicroscopicsilicovolcanoconiosis Smith',
    'SQL Injection': "Robert'); DROP TABLE Students;--",
    'XSS': '<script>alert("XSS")</script>',
    'HTML Injection': '<div>Injected HTML</div>',
    'JavaScript Injection': '"); alert("Injected JS"); ("',
    'Command Injection': 'test; ls -la',
    'LDAP Injection': 'admin)(|(password=*',
    'Path Traversal': '../../etc/passwd',
    'Hindi': 'नमस्ते दुनिया',
    'Arabic': 'مرحبا بالعالم',
    'Chinese': '你好，世界',
    'Japanese': 'こんにちは世界',
    'Russian': 'Привет, мир'
  },
  'Email': {
    'Valid': 'test@example.com',
    'Invalid Format': 'invalid.email@com',
    'Special Characters': 'test+label@example.com',
    'Long': 'very.long.email.address.that.is.really.long@really.long.domain.name.com',
    'Hindi': 'उदाहरण@डोमेन.कॉम',
    'Arabic': 'مثال@نطاق.كوم',
    'Chinese': '测试@例子.公司',
    'Japanese': 'テスト@例.会社',
    'Russian': 'тест@пример.ком'
  },
  'Phone': {
    'US Format': '(555) 123-4567',
    'International': '+44 20 7123 4567',
    'Invalid': 'abc-def-ghij',
    'Special Characters': '+1 (555) #123-4567'
  },
  'Address': {
    'Simple': '123 Main St',
    'Special Characters': '456 Elm St, Apt #7',
    'Long': '7890 Long Street Name That Goes On and On, Suite 100, Some City, Some State, 12345',
    'Empty': ''
  },
  'Date': {
    'Valid': '2023-10-05',
    'Invalid Format': '31/02/2023',
    'Future': '2099-12-31',
    'Past': '1900-01-01'
  },
  'URL': {
    'Valid': 'https://www.example.com',
    'Invalid Format': 'htp:/invalid-url',
    'Special Characters': 'https://www.example.com/search?q=test+data',
    'Long': 'https://www.this-is-a-very-long-url-example.com/with/a/very/long/path/that/keeps/going/on/and/on'
  }
};
const additionalTestData = {
  
};

Object.assign(testData, additionalTestData);
// Create main menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'testDataInjector',
    title: 'Test Data Injector',
    contexts: ['editable']
  });

  // Create category submenus
  for (const category in testData) {
    chrome.contextMenus.create({
      id: category,
      parentId: 'testDataInjector',
      title: category,
      contexts: ['editable']
    });

    // Create data items for each category
    for (const item in testData[category]) {
      chrome.contextMenus.create({
        id: `${category}_${item}`,
        parentId: category,
        title: item,
        contexts: ['editable']
      });
    }
  }
});

// Handle menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.includes('_')) {
    const [category, item] = info.menuItemId.split('_');
    const valueToInject = testData[category][item];
    
    // Inject the test data into the active input field
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (value) => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          activeElement.value = value;
          // Dispatch input and change events
          activeElement.dispatchEvent(new Event('input', { bubbles: true }));
          activeElement.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      args: [valueToInject]
    });
  }
});