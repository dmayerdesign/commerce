// declare module 'types/@easypost/api' {

    export interface Easypost {
        Address: typeof Easypost.Address
        CustomsInfo: any
        Insurance: typeof Easypost.Insurance
        Parcel: any
        Shipment: typeof Easypost.Shipment

        new(apiKey: string)
    }

    export namespace Easypost {

        export class FieldError {
            public readonly field: string
            public readonly message: string
        }

        export class Error {
            public readonly code: string
            public readonly message: string
            public readonly errors: FieldError[]
        }

        /**
         * Parent class for Easypost resources
         *
         * @export
         * @class Resource
         */
        export abstract class Resource<T = string> {
            public readonly id: string
            public readonly object: T
        }

        export abstract class TimestampedResource<T = string> extends Resource<T> {
            /** @member {string} created_at Is an ISO string */
            public readonly created_at: string
            /** @member {string} updated_at Is an ISO string */
            public readonly updated_at: string
        }


        export class VerificationDetails {
            public readonly latitude: number
            public readonly longitude: number
            public readonly time_zone: string
        }

        export class Verification {
            public readonly success: boolean
            public readonly errors: FieldError[]
            public readonly details: VerificationDetails
        }

        export class Verifications {
            public zip4: Verification
            public delivery: Verification
        }

        export class Address extends Resource<'Address'> {
            public mode: string
            public street1: string
            public street2: string
            public city: string
            public state: string
            public zip: string
            public country: string
            public residential: boolean
            public carrier_facility: string
            public name: string
            public company: string
            public phone: string
            public email: string
            public federal_tax_id: string
            public state_tax_id: string
            public verifications: Verifications

            public save: () => Promise<Address>

            constructor(newAddress: {
                street1: string
                street2?: string
                city: string
                state: string
                zip: string
                country: string
                residential?: boolean
                carrier_facility?: string
                name?: string
                company?: string
                phone?: string
                email?: string
                federal_tax_id?: string
                state_tax_id?: string
                verifications?: Verifications
            }) {
                super()
            }
        }

        export class Form extends TimestampedResource {
            public readonly object: 'Form'
            public readonly mode: 'test' | 'production'
            public form_type: 'commercial_invoice' // Should always be 'commercial_invoice'
            public form_url: string
            public readonly submitted_electronically: boolean
        }


        export class Rate extends TimestampedResource<'Rate'> {
            public readonly mode: 'test' | 'production' /* "test" or "production" */
            public readonly service: string /* service level/name */
            public readonly carrier: string /* name of carrier */
            public readonly carrier_account_id: string /* ID of the CarrierAccount record used to generate this rate */
            public readonly shipment_id: string /* ID of the Shipment this rate belongs to */
            public readonly rate: string /* the actual rate quote for this service */
            public readonly currency: string /* currency for the rate */
            public readonly retail_rate: string /* the retail rate is the in-store rate given with no account */
            public readonly retail_currency: string /* currency for the retail rate */
            public readonly list_rate: string /* the list rate is the non-negotiated rate given for having an account with the carrier */
            public readonly list_currency: string /* currency for the list rate */
            public readonly delivery_days: number /* delivery days for this service */
            public readonly delivery_date: string /* date for delivery */
            public readonly delivery_date_guaranteed: boolean /* indicates if delivery window is guaranteed (true) or not (false) */
            public readonly est_delivery_days?: number /* This field is deprecated and should be ignored. */
        }

        export class Insurance extends TimestampedResource<'Insurance'> {
            public readonly mode: string /*	"test" or "production" */
            public readonly reference: string /* The unique reference for this Insurance, if any */
            public readonly amount: string /* USD value of insured goods with sub-cent precision */
            public readonly provider: string /*	The insurance provider used by EasyPost */
            public readonly provider_id: string /* An identifying number for some insurance providers used by EasyPost */
            public readonly shipment_id: string /* The ID of the Shipment in EasyPost, if postage was purchased via EasyPost */
            public readonly tracking_code: string /* The tracking code of either the shipment within EasyPost, or provided by you during creation */
            public readonly status: string /* The current status of the insurance, possible values are "new", "pending","purchased", "failed", or "cancelled" */
            public readonly tracker: any /* Tracker */ /* The associated Tracker object */
            public readonly to_address: Address /* The associated Address object for destination */
            public readonly from_address: Address /* The associated Address object for origin */
            public readonly fee: any /* Fee */ /* The associated InsuranceFee object if any */
            public readonly messages: string[] /* The list of errors encountered during attempted purchase of the insurance */
        }

        export interface ShipmentOptions {
            additional_handling: boolean /* Setting this option to true, will add an additional handling charge. */
            address_validation_level: string /* Setting this option to "0", will allow the minimum amount of address information to pass the validation check. Only for USPS postage. */
            alcohol: boolean /* Set this option to true if your shipment contains alcohol. */
            bill_receiver_account: string /* Setting an account number of the receiver who is to receive and buy the postage. */
            bill_receiver_postal_code: string /* Setting a postal code of the receiver account you want to buy postage. */
            bill_third_party_account: string /* Setting an account number of the third party account you want to buy postage. */
            bill_third_party_country: string /* Setting a country of the third party account you want to buy postage. */
            bill_third_party_postal_code: string /* Setting a postal code of the third party account you want to buy postage. */
            by_drone: boolean /* Setting this option to true will indicate to the carrier to prefer delivery by drone, if the carrier supports drone delivery. */
            carbon_neutral: boolean /* Setting this to true will add a charge to reduce carbon emissions. */
            cod_amount: string /* Adding an amount will have the carrier collect the specified amount from the recipient. */
            cod_method: string /* Method for payment. "CASH", "CHECK", "MONEY_ORDER" */
            currency: string /* Which currency this shipment will show for rates if carrier allows. */
            delivery_confirmation: string /* If you want to request a signature, you can pass "ADULT_SIGNATURE" or "SIGNATURE". You may also request "NO_SIGNATURE" to leave the package at the door. */
            dry_ice: boolean /* Package contents contain dry ice. */
            dry_ice_medical: string /* If the dry ice is for medical use, set this option to true. */
            dry_ice_weight: string /* Weight of the dry ice in ounces. */
            endorsement: string /* Possible values "ADDRESS_SERVICE_REQUESTED", "FORWARDING_SERVICE_REQUESTED", "CHANGE_SERVICE_REQUESTED", "RETURN_SERVICE_REQUESTED", "LEAVE_IF_NO_RESPONSE" */
            freight_charge: number /* Additional cost to be added to the invoice of this shipment. Only applies to UPS currently. */
            handling_instructions: string /* This is to designate special instructions for the carrier like "Do not drop!". */
            hazmat: string /* Dangerous goods indicator. Possible values are "ORMD" and "LIMITED_QUANTITY". Applies to USPS, FedEx and DHL eCommerce. */
            hold_for_pickup: boolean /* Package will wait at carrier facility for pickup. */
            incoterm: string /* Incoterm negotiated for shipment. Supported values are "EXW", "FCA", "CPT", "CIP", "DAT", "DAP", "DDP", "FAS", "FOB", "CFR", and "CIF". Setting this value to anything other than "DDP" will pass the cost and responsibility of duties on to the recipient of the package(s), as specified by Incoterms rules */
            invoice_number: string /* This will print an invoice number on the postage label. */
            label_date: string /* Set the date that will appear on the postage label. Accepts ISO 8601 formatted string including time zone offset. EasyPost stores all dates as UTC time. */
            label_format: string /* Supported label formats include "PNG", "PDF", "ZPL", and "EPL2". "PNG" is the only format that allows for conversion. */
            machinable: boolean /* Whether or not the parcel can be processed by the carriers equipment. */
            print_custom_1: string /* You can optionally print custom messages on labels. The locations of these fields show up on different spots on the carrier's labels. */
            print_custom_2: string /* An additional message on the label. Same restrictions as print_custom_1 */
            print_custom_3: string /* An additional message on the label. Same restrictions as print_custom_1 */
            print_custom_1_barcode: boolean /* Create a barcode for this custom reference if supported by carrier. */
            print_custom_2_barcode: boolean /* Create a barcode for this custom reference if supported by carrier. */
            print_custom_3_barcode: boolean /* Create a barcode for this custom reference if supported by carrier. */
            print_custom_1_code: string /* Specify the type of print_custom_1. */
        }

        export interface NewShipment {
            reference?: string
            to_address?: Address
            from_address?: Address
            parcel?: any /* Parcel */
            carrier_accounts?: string[]
            customs_info?: any /* CustomsInfo */
        }

        /**
         * An Easypost Shipment
         *
         * {@link https://www.easypost.com/docs/api.html#shipments Easypost#shipments}
         * @export
         * @class Shipment
         * @extends {Resource}
         */
        export class Shipment extends TimestampedResource<'Shipment'> {
            public static retrieve: (shipmentId: string) => Promise<Shipment>

            public reference?: string
            public readonly mode?: 'test' | 'production'
            public to_address: Address
            public from_address: Address
            public return_address?: Address
            public buyer_address?: Address
            public parcel: any /* Parcel */
            public customs_info?: any /* CustomsInfo */
            public scan_form?: any /* ScanForm */
            public forms?: Form[]
            public insurance?: any /* Insurance */
            public rates?: Rate[]
            public selected_rate: Rate
            public postage_label: any /* PostageLabel */
            public messages?: any[] /* Message[] */
            public options?: ShipmentOptions
            public is_return?: boolean
            public tracking_code?: string
            public usps_zone?: string
            public readonly status?: string
            public readonly tracker?: any /* Tracker */
            public fees?: any[] /* Fee[] */
            public refund_status?: 'submitted' | 'refunded' | 'rejected'
            public batch_id?: string
            public batch_status?: string
            public batch_message?: string
            public carrier_accounts?: string[]

            public buy: (rate: string | Rate, insurance: number) => Promise<Shipment>
            public lowestRate: () => Rate
            public save: () => Promise<Shipment>

            constructor(s?: NewShipment) {
                super()
            }
        }
    }
// }
