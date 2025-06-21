import { PDFDocument } from "pdf-lib";
import fs from "fs";

export class ContractAuto {
    #templatePath = "./templates/contract_auto_final_template.pdf";
    #outputPath = "filled-contract.pdf";
    #contractFields;
    #requiredFields = [
        "sellerName",
        "sellerCounty",
        "sellerCity",
        "sellerDistrict",
        "sellerStreet",
        "sellerIdSeries",
        "sellerIdNumber",
        "sellerCnpOrCif",
        "buyerName",
        "buyerCounty",
        "buyerCity",
        "buyerDistrict",
        "buyerStreet",
        "buyerIdSeries",
        "buyerIdNumber",
        "buyerCnpOrCif",
        "vehicleBrand",
        "vehicleModel",
        "vehicleChassisNumber",
        "vehicleEngineSeries",
        "vehicleCubicCapacity",
        "vehicleMaxWeight",
        "vehicleRegistrationNumber",
        "vehicleCivSeries",
        "vehicleYear",
        "vehicleEuroNorm",
        "priceDigits",
        "priceLetters"
    ];

    constructor(formValues) {
        this.formValues = formValues;
        this.#contractFields = this.getEmptyContractFields();
    }

    getEmptyContractFields() {
        return {
            sellerName: "",
            sellerCountry: "",
            sellerCounty: "",
            sellerPostalCode: "",
            sellerCity: "",
            sellerDistrict: "",
            sellerStreet: "",
            sellerStreetNumber: "",
            sellerBlock: "",
            sellerStaircase: "",
            sellerFloor: "",
            sellerApartment: "",
            sellerIdSeries: "",
            sellerIdNumber: "",
            sellerCnpOrCif: "",
            sellerPhone: "",
            sellerEmail: "",
            // Vânzător (fiscal / persoană juridică)
            sellerFiscalCountry: "",
            sellerFiscalCounty: "",
            sellerFiscalPostalCode: "",
            sellerFiscalCity: "",
            sellerFiscalDistrict: "",
            sellerFiscalStreet: "",
            sellerFiscalStreetNumber: "",
            sellerFiscalBlock: "",
            sellerFiscalStaircase: "",
            sellerFiscalFloor: "",
            sellerFiscalApartment: "",
            sellerLegalRepName: "",
            sellerLegalRepIdSeries: "",
            sellerLegalRepIdNumber: "",
            sellerLegalRepCnp: "",
            sellerLegalRepPhone: "",
            sellerLegalRepEmail: "",
            sellerLegalRepTitle: "",

            // Cumpărător
            buyerName: "",
            buyerCountry: "",
            buyerCounty: "",
            buyerPostalCode: "",
            buyerCity: "",
            buyerDistrict: "",
            buyerStreet: "",
            buyerStreetNumber: "",
            buyerBlock: "",
            buyerStaircase: "",
            buyerFloor: "",
            buyerApartment: "",
            buyerIdSeries: "",
            buyerIdNumber: "",
            buyerCnpOrCif: "",
            buyerPhone: "",
            buyerEmail: "",
            // Cumpărător (fiscal / persoană juridică)
            buyerFiscalCountry: "",
            buyerFiscalCounty: "",
            buyerFiscalPostalCode: "",
            buyerFiscalCity: "",
            buyerFiscalDistrict: "",
            buyerFiscalStreet: "",
            buyerFiscalStreetNumber: "",
            buyerFiscalBlock: "",
            buyerFiscalStaircase: "",
            buyerFiscalFloor: "",
            buyerFiscalApartment: "",
            buyerLegalRepName: "",
            buyerLegalRepIdSeries: "",
            buyerLegalRepIdNumber: "",
            buyerLegalRepCnp: "",
            buyerLegalRepPhone: "",
            buyerLegalRepEmail: "",
            buyerLegalRepTitle: "",

            // Obiectul contractului
            vehicleBrand: "",
            vehicleModel: "",
            vehicleChassisNumber: "",
            vehicleEngineSeries: "",
            vehicleCubicCapacity: "",
            vehicleMaxWeight: "",
            vehicleRegistrationNumber: "",
            vehicleItpExpiry: "",
            vehicleCivSeries: "",
            vehicleYear: "",
            vehicleEuroNorm: "",
            vehicleAcquisitionDate: "",
            acquisitionDocument: "",

            // Preț și detalii contract
            priceDigits: "",
            priceLetters: "",
            // annexesYes: "",
            // annexesNo: "",
            contractDate: "",
            contractPlace: ""
        }
    }

    isInputSafe(key, value) {
        const isString = typeof value === "string";
        const isNotEmpty = value.trim() !== "";
        const isClean = !/<script|<\/script|<.*?>/.test(value);
        const isRequired = this.#requiredFields.includes(key);

        if (isRequired) {
            return isString && isNotEmpty && isClean;
        }

        if (isString && isNotEmpty) {
            return isClean;
        }

        return !isRequired;
    }

    validateForm() {
        for (let [key, value] of Object.entries(this.formValues)) {
            if (!this.isInputSafe(key, value)) {
                throw new Error(`Invalid input at ${key}: ${value}`);
            }
        }
    }

    mapFormValues() {
        for (const key of Object.keys(this.formValues)) {
            if (key in this.#contractFields) {
                this.#contractFields[key] = this.formValues[key];
            }
        }
    }

    async populatePdfForm() {
        try {
            const pdfBytes = fs.readFileSync(this.#templatePath);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const form = pdfDoc.getForm();

            form.getFields().forEach(field => {
                const fieldName = field.getName();
                if (field.constructor.name === "PDFCheckBox") {
                    const checkbox = form.getCheckBox(fieldName);
                    const value = this.#contractFields[fieldName];

                    if (value?.toString().toLowerCase() === "da") {
                        checkbox.check();
                    } else {
                        checkbox.uncheck();
                    }

                } else if (field.constructor.name === "PDFTextField") {
                    const targetField = form.getTextField(fieldName);
                    targetField.setText(this.#contractFields[fieldName]);
                }
            })

            const completedPdf = await pdfDoc.save();
            fs.writeFileSync(this.#outputPath, completedPdf);
        } catch (err) {
            console.log(err);
        }
    }

    async generate() {
        this.validateForm();
        this.mapFormValues();
        await this.populatePdfForm();

        return this.#outputPath;
    }
}