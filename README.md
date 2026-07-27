DevSec-App

A DevSecOps pipeline dashboard that runs and visualizes automated security checks as part of a CI/CD workflow — bringing security scanning into the same loop as build and deploy, instead of treating it as a separate, after-the-fact step.

Overview

DevSec-App wraps common security scanning steps (dependency checks, static analysis, etc.) into a pipeline that runs through GitHub Actions and reports results in a simple dashboard, so a team can see the security posture of a build at a glance rather than digging through raw CI logs.

Pipeline
Code push → GitHub Actions trigger
        → Dependency / vulnerability scan
        → Static analysis
        → Results collected & scored
        → Dashboard updated with run history


Features
Automated security pipeline triggered on push via GitHub Actions
Consolidated results view — scan output is summarized instead of left as raw logs
Run history — past pipeline runs are persisted, so you can track security posture over time instead of only seeing the latest run




        


