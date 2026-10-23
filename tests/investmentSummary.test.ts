import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {PDFDocument} from 'pdf-lib';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {investmentSummaryPdf} from '../src/lib/investmentSummaryPdf';
import {InvestmentDetailsTab} from '../src/components/investor/InvestmentDetailsTab';
import type {InvestorUser,InvestorOverviewMetrics} from '../src/types';
const user={name:'QA Investor (PDF)',username:'qa-pdf',agreementNumber:'QA-UNSIGNED-123',joiningDate:'2026-10-23',platformTimezone:'Asia/Kolkata',planTerms:{name:'QA saved plan',dailyReturnPercent:.5,durationMonths:12,payoutRequestDays:7,managementFeePercent:0,withdrawalEntryFeePercent:0}} as InvestorUser;
test('terms export creates a readable one-page PDF document',async()=>{
 const bytes=await investmentSummaryPdf(user,10000),pdf=await PDFDocument.load(bytes);
 assert.equal(pdf.getPageCount(),1);assert.equal(pdf.getTitle(),'FINOVATECK Investment Terms Summary');
 await fs.mkdir('docs/strict-qa-20261023',{recursive:true});
 await fs.writeFile('docs/strict-qa-20261023/terms-summary-sample.pdf',bytes);
});
test('investment screen uses saved terms without fake download, signature or mining allocation claims',()=>{
 const html=renderToStaticMarkup(React.createElement(InvestmentDetailsTab,{user,metrics:{totalInvestmentUsd:10000} as InvestorOverviewMetrics}));
 assert.match(html,/QA saved plan/);assert.match(html,/0.5%/);assert.match(html,/Download Terms Summary PDF/);assert.match(html,/unsigned/);
 assert.doesNotMatch(html,/125\.0 TH|Foundry|0\.042|Signature Verified|2\.4 MB|Stamped PDF/);
});
