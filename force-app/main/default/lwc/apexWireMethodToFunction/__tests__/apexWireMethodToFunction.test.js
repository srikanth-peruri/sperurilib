import { createElement } from 'lwc';
import ApexWireMethodToFunction from 'c/apexWireMethodToFunction';
import { registerApexTestWireAdapter } from '@salesforce/lwc-jest';
import getContactList from '@salesforce/apex/ContactController.getContactList';

// Realistic data with a list of contacts
const mockGetContactList = require('./data/getContactList.json');

// An empty list of records to verify the component does something reasonable
// when there is no data to display
const mockGetContactListNoRecords = require('./data/getContactListNoRecords.json');

// Register as Apex wire adapter. Some tests verify that provisioned values trigger desired behavior.
const getContactListAdapter = registerApexTestWireAdapter(getContactList);

describe('c-apex-wire-method-to-function', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
    });

    describe('getContactList @wire data', () => {
        it('renders six records', () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-to-function', {
                is: ApexWireMethodToFunction
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactList);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(mockGetContactList.length);
                expect(detailEls[0].textContent).toBe(
                    mockGetContactList[0].Name
                );
            });
        });

        it('renders no items when no records are returned', () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-to-function', {
                is: ApexWireMethodToFunction
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getContactListAdapter.emit(mockGetContactListNoRecords);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                // Select elements for validation
                const detailEls = element.shadowRoot.querySelectorAll('p');
                expect(detailEls.length).toBe(
                    mockGetContactListNoRecords.length
                );
            });
        });
    });

    describe('getContactList @wire error', () => {
        it('shows error panel element', () => {
            // Create initial element
            const element = createElement('c-apex-wire-method-to-function', {
                is: ApexWireMethodToFunction
            });
            document.body.appendChild(element);

            // Emit error from @wire
            getContactListAdapter.error();

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            return Promise.resolve().then(() => {
                const errorPanelEl = element.shadowRoot.querySelector(
                    'c-error-panel'
                );
                expect(errorPanelEl).not.toBeNull();
            });
        });
    });
});
