import { PDFDocument } from "pdf-lib";
import fs from "fs";

export class ContractAuto {
    #templatePath = "./templates/contract_auto.pdf";
    #outputPath = "./output/filled-contract.pdf";
    #contractFields;
    #requiredFields = [
        "Nume/denumire vanzator",
        "Judet vanzator",
        "Municipiu/oras/comuna vanzator",
        "Sat/sector vanzator",
        "Str vanzator",
        "Serie CI vanzator",
        "Nr CI vanzator",
        "CNP/CIF vanzator",
        "Nume/denumire cumparator",
        "Judet cumparator",
        "Municipiu/oras/comuna cumparator",
        "Sat/sector cumparator",
        "Str cumparator",
        "Serie CI cumparator",
        "Nr CI cumparator",
        "CNP/CIF cumparator",
        "Tipul mijlocului de transport",
        "Nr identificare al mijlocului de transport",
        "Marca mijlocului de transport",
        "Seria motorului mijlocului de transport",
        "Greutatea maxima admisa a remorcii/semiremorcii",
        "Capacitatea cilindrica a motorului mijlocului de transport",
        "Nr de inmatriculare/inregistrare al mijlocului de transport",
        "Seria si nr CIV",
        "An de fabricatie",
        "Norma euro",
        "Pret (cifre)",
        "Data dobandirii",
        "Data incheierii",
        "Pret (litere)",
        "Locul incheierii",
    ];

    constructor(formValues) {
        this.formValues = formValues;
        this.#contractFields = this.getEmptyContractFields();
    }

    getEmptyContractFields() {
        return {
            "Nume/denumire vanzator": "",
            "Tara vanzator": "",
            "Judet vanzator": "",
            "CP vanzator": "",
            "Municipiu/oras/comuna vanzator": "",
            "Sat/sector vanzator": "",
            "Str vanzator": "",
            "Nr vanzator": "",
            "Bl vanzator": "",
            "Sc vanzator": "",
            "Et vanzator": "",
            "Ap vanzator": "",
            "Serie CI vanzator": "",
            "Nr CI vanzator": "",
            "CNP/CIF vanzator": "",
            "Tel/Fax vanzator": "",
            "E-mail vanzator": "",
            "Tara fiscala vanzator": "",
            "Judet fiscal vanzator": "",
            "CP fiscal vanzator": "",
            "Municipiu/oras/comuna fiscal vanzator": "",
            "Sat/sector fiscal vanzator": "",
            "Str fiscala vanzator": "",
            "Nr fiscal vanzator": "",
            "Bl fiscal vanzator": "",
            "Sc fiscal vanzator": "",
            "Et fiscal vanzator": "",
            "Ap fiscal vanzator": "",
            "Reprezentant vanzator": "",
            "Serie CI reprezentant vanzator": "",
            "Nr CI reprezentant vanzator": "",
            "CNP reprezentant vanzator": "",
            "Tel/Fax reprezentant vanzator": "",
            "E-mail reprezentant vanzator": "",
            "Calitate reprezentant vanzator": "",
            "Nume/denumire cumparator": "",
            "Tara cumparator": "",
            "Judet cumparator": "",
            "CP cumparator": "",
            "Municipiu/oras/comuna cumparator": "",
            "Sat/sector cumparator": "",
            "Str cumparator": "",
            "Nr cumparator": "",
            "Bl cumparator": "",
            "Sc cumparator": "",
            "Et cumparator": "",
            "Ap cumparator": "",
            "Serie CI cumparator": "",
            "Nr CI cumparator": "",
            "CNP/CIF cumparator": "",
            "Tel/Fax cumparator": "",
            "E-mail cumparator": "",
            "Tara fiscala cumparator": "",
            "Judet fiscal cumparator": "",
            "CP fiscal cumparator": "",
            "Municipiu/oras/comuna fiscal cumparator": "",
            "Sat/sector fiscal cumparator": "",
            "Str fiscala cumparator": "",
            "Nr fiscal cumparator": "",
            "Bl fiscal cumparator": "",
            "Sc fiscal cumparator": "",
            "Et fiscal cumparator": "",
            "Ap fiscal cumparator": "",
            "Reprezentant cumparator": "",
            "Serie CI reprezentant cumparator": "",
            "Nr CI reprezentant cumparator": "",
            "CNP reprezentant cumparator": "",
            "Tel/Fax reprezentant cumparator": "",
            "E-mail reprezentant cumparator": "",
            "Calitate reprezentant cumparator": "",
            "Tipul mijlocului de transport": "",
            "Nr identificare al mijlocului de transport": "",
            "Marca mijlocului de transport": "",
            "Seria motorului mijlocului de transport": "",
            "Greutatea maxima admisa a remorcii/semiremorcii": "",
            "Capacitatea cilindrica a motorului mijlocului de transport": "",
            "Nr de inmatriculare/inregistrare al mijlocului de transport": "",
            "Seria si nr CIV": "",
            "An de fabricatie": "",
            "Norma euro": "",
            "Data expirarii ITP": "",
            "Actul dobandirii": "",
            "Pret (cifre)": "",
            "Anexe NU": "",
            "Data dobandirii": "",
            "Data incheierii": "",
            "Pret (litere)": "",
            "Locul incheierii": "",
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