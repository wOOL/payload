'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '../../../_components/Button'
import { Input } from '../../../_components/Input'
import { Message } from '../../../_components/Message'
import { useAuth } from '../../../_providers/Auth'

import classes from './index.module.scss'

type FormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
  termsAccepted: boolean
}

const CreateAccountForm: React.FC = () => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const { login } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [hasReadTerms, setHasReadTerms] = useState(false)
  const [isTermsAccepted, setIsTermsAccepted] = useState(false)
  const termsRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>()

  const password = useRef({})
  password.current = watch('password', '')

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current
      if (scrollHeight - scrollTop - clientHeight < 5) {
        setHasReadTerms(true)
      }
    }
  }

  const handleTermsCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasReadTerms) {
      e.preventDefault()
      alert('Please read through the entire Terms and Conditions before accepting.')
      setIsTermsAccepted(false)
      return
    }
    setIsTermsAccepted(e.target.checked)
  }

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!isTermsAccepted) {
        setError('You must accept the Terms and Conditions to create an account.')
        return
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const message = response.statusText || 'There was an error creating the account.'
        setError(message)
        return
      }

      const redirect = searchParams.get('redirect')

      const timer = setTimeout(() => {
        setLoading(true)
      }, 1000)

      try {
        await login(data)
        clearTimeout(timer)
        if (redirect) router.push(redirect as string)
        else router.push(`/account?success=${encodeURIComponent('Account created successfully')}`)
      } catch (_) {
        clearTimeout(timer)
        setError('There was an error with the credentials provided. Please try again.')
      }
    },
    [login, router, searchParams],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
      <Message error={error} className={classes.message} />
      <div className={classes.termsContainer}>
        <h3>Terms and Conditions of Use</h3>
        <div
          ref={termsRef}
          className={classes.termsText}
          onScroll={handleScroll}
        >
          <p><span>IMPORTANT
            LEGAL NOTICE TO ALL USERS: CAREFULLY READ THE FOLLOWING TERMS AND CONDITIONS
            AND AGREEMENT BEFORE YOU START USING THE BECERTAIN WEB-BASED APPLICATION (BECERTAIN). </span></p>

          <p><span>BY USING
            THIS WEB-APPLICATION YOU CONSENT TO BE BOUND BY THE TERMS AND CONDITIONS OF
            THIS AGREEMENT. IF YOU DO NOT AGREE TO ALL OF THE TERMS AND CONDITIONS OF THIS
            AGREEMENT, DO NOT USE THE WEB-BASED APPLICATION. ABSENT YOUR AGREEMENT TO THE
            TERMS BELOW, YOU HAVE NO RIGHTS WHATSOEVER TO HOLD OR USE THE WEB-BASED
            APPLICATION.</span></p>

          <p><b><span>Terms</span></b></p>

          <p><span>By
            accessing this site, you agree to <b>BECERTAINs Terms and Conditions of Use</b>,
            and agree that you are responsible for compliance with them or any applicable
            laws and regulations.</span></p>

          <p><span>If you do
            not agree with any of these terms, you must not access this site. The materials
            contained in this web site are protected by applicable copyright law.</span></p>

          <p><span>You need
            to <b>accept these terms</b> in order to access the BECERTAIN tool and to upload
            any images. The uploaded images, data and the generated results will be stored temporarily
            on servers in London. <b>After XXXX days, all the images, data and the results
              are deleted forever and cannot be recovered.</b></span></p>

          <p><b><span>End
            User License Agreement</span></b></p>

          <p><span>This End
            User License Agreement (this &quot;Agreement&quot;), is a binding agreement
            between BECERTAIN and you (where &quot;you&quot; means (and &quot;your&quot;
            refers to) any individual or legal entity that exercises the permissions
            granted by this License). </span></p>

          <p><span>You agree
            to use the services only for purposes that are permitted by these Terms and any
            applicable law, regulation or generally accepted practices or guidelines in the
            relevant jurisdictions.</span></p>

          <p><span>You agree
            not to attempt to access BECERTAIN services by any means other than through the
            interface that is provided on the BECERTAIN site. Also, you agree that you will
            not attempt to decompile or reverse engineer any software contained in this
            site.</span></p>

          <p><span>You must
            have the right to use the images submitted to BECERTAIN (patient consent if
            applicable). </span></p>

          <p><span>You are
            responsible to anonymize the data submitted to BECERTAIN, no personal name or
            any other information able to identify the person has to be included in the
            file names or their content.</span></p>

          <p><span>You agree
            that you will not engage in any activity that interferes with or disrupts BECERTAIN.</span></p>

          <p><span>You may
            not reproduce, duplicate, copy, sell, trade or resell BECERTAIN for any
            purpose.</span></p>

          <p><span>You
            undertake to use BECERTAIN on your own and entire liability.</span></p>

          <p><span>You
            expressly agree that in no case shall BECERTAIN be declared liable for any
            direct, indirect, incidental, consequential or special damages suffered by you
            as a result of the use of BECERTAIN, as well as for any difficulty experienced
            during its use or for it being impossible to use.</span></p>

          <p><span>You are
            responsible for ensuring that the technical characteristics and functions of BECERTAIN
            corresponds to your needs.</span></p>

          <p><span>You are
            completely responsible for the results that you may obtain while using BECERTAIN.</span></p>

          <p><b><span>NOT FOR
            DIAGNOSTIC USE OR TO AID DIAGNOSIS OR CLINICAL USE.&nbsp;</span></b><span>The Web-based application is not be
              used for or in diagnostic purposes. No data obtained from the tool should be
              used in a clinical, patient, treatment, prognosis setting and that any such
              uses are expressly prohibited.</span></p>

          <p><b><span>NOT
            AVAILABLE FOR COMMERCIAL USE.</span></b><span>
              Any use of the web-based application for commercial purposes in any form is not
              allowed.</span></p>

          <p><b><span>NO
            REDISTRIBUTION OF SOFTWARE.</span></b><span>
              The web-based application remains the property of BECERTAIN. You shall not
              publish, distribute, or otherwise transfer or make available the web-based
              application to any other party.</span></p>

          <p><b><span>Provision
            of Service</span></b></p>

          <p><span>You
            acknowledge that the services provided in this site may change from time to
            time without prior notice.</span></p>

          <p><span>You acknowledge
            that BECERTAIN may stop permanently or temporarily providing the services or
            any features within without prior notice.</span></p>

          <p><span>You
            acknowledge that there may be a limit on the number of transmissions you may
            send or receive through the services or on the amount of storage space used for
            their provision.</span></p>

          <p><span>You
            acknowledge that BECERTAIN is a research prototype and may therefore contain
            possible imperfections or errors for which BECERTAIN disclaim any liability.</span></p>

          <p><span>You are
            advised to safeguard important data, to use caution and not to rely in any way
            on the correct functioning or performance of BECERTAIN.</span></p>

          <p><span>You will
            make your best efforts to notify BECERTAIN of any error or any other defect of BECERTAIN
            which comes to its notice during the use. In that case, you will make your best
            efforts to notify to BECERTAIN of the error and of the relevant correction.</span></p>

          <p><span>We do not
            offer any guarantee nor maintenance services to ensure that BECERTAIN operates
            in good working order.</span></p>

          <p><span>We are
            under no obligation: </span></p>

          <ul>
            <li><span>to
              provide assurance that any specific errors or discrepancies in BECERTAIN will
              be corrected</span></li>
            <li><span>to
              provide you any technical support.</span></li>
          </ul>

          <p><b><span>Disclaimer</span></b></p>

          <p><span>The
            BECERTAIN functionality made available on this page is provided &quot;as
            is&quot; with no warranties whatsoever.</span></p>

          <p><span>In no
            event shall BECERTAIN or its representatives be liable for any damages
            resulting from the use or inability to use BECERTAIN.</span></p>

          <p><span>BECERTAIN,
            on its own behalf and on behalf of all of its service providers associated with
            the BECERTAIN and its licensors, hereby expressly exclude to the fullest extent
            permitted by law all express, implied, and statutory warranties and conditions
            including, without limitation, warranties and conditions of merchantability,
            fitness for any particular purpose, non-infringement of proprietary rights,
            security, reliability, timeliness, and performance.</span></p>

          <p><span>You hereby
            acknowledge and agree that: (a) your use of BECERTAIN is entirely at your own
            discretion and risk; (b) BECERTAIN excludes all liability for any loss or
            damage arising from such use to the fullest extent permissible by law; (c)
            BECERTAIN is for information purposes only, you are not entitled to base any
            treatment or other medical decision on information obtained from BECERTAIN and
            you agree to be solely responsible for, and to indemnify BECERTAIN and hold
            BECERTAIN harmless against, any loss or damage arising from any such decision.</span></p>

          <p><span>By using
            the BECERTAIN service, you accept the conditions of use for this tool.</span></p>

          <p><span>INFORMATION
            PROVIDED BY BECERTAIN IS NOT INTENDED TO REPLACE CLINICAL JUDGEMENT</span></p>

          <p><b><span>Modification</span></b></p>

          <p><span>These
            Terms of Use may be revised and changed at any time without notice.</span></p>

          <p><span>By using
            this service, you agree to be bound by the current version of these Terms and
            Conditions at that moment.</span></p>
        </div>
      </div>
      <div className={classes.termsCheckbox}>
        <input
          type="checkbox"
          checked={isTermsAccepted}
          onChange={handleTermsCheckbox}
        />
        <label>I agree to the Terms and Conditions stated above</label>
        {!hasReadTerms && isTermsAccepted && (
          <span className={classes.error}>Please read the entire Terms and Conditions first</span>
        )}
      </div>
      <Input
        name="name"
        label="Name"
        required
        register={register}
        error={errors.root}
        type="text"
      />
      <Input
        name="email"
        label="Email Address"
        required
        register={register}
        error={errors.email}
        type="email"
      />
      <Input
        name="password"
        type="password"
        label="Password"
        required
        register={register}
        error={errors.password}
      />
      <Input
        name="passwordConfirm"
        type="password"
        label="Confirm Password"
        required
        register={register}
        validate={value => value === password.current || 'The passwords do not match'}
        error={errors.passwordConfirm}
      />
      <Button
        type="submit"
        label={loading ? 'Processing' : 'Create Account'}
        disabled={loading}
        appearance="primary"
        className={classes.submit}
      />
      <div>
        {'Already have an account? '}
        <Link href={`/login${allParams}`}>Login</Link>
      </div>
    </form>
  )
}

export default CreateAccountForm
