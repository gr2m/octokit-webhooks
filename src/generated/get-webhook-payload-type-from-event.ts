import { EventPayloads } from "./event-payloads";
import { WebhookEventHandlerError } from "../types";
export interface EventTypesPayload {
  error: WebhookEventHandlerError;
  "*": any;
  check_run: EventPayloads.WebhookPayloadCheckRun;
  "check_run.completed": EventPayloads.WebhookPayloadCheckRun;
  "check_run.created": EventPayloads.WebhookPayloadCheckRun;
  "check_run.requested_action": EventPayloads.WebhookPayloadCheckRun;
  "check_run.rerequested": EventPayloads.WebhookPayloadCheckRun;
  check_suite: EventPayloads.WebhookPayloadCheckSuite;
  "check_suite.completed": EventPayloads.WebhookPayloadCheckSuite;
  "check_suite.requested": EventPayloads.WebhookPayloadCheckSuite;
  "check_suite.rerequested": EventPayloads.WebhookPayloadCheckSuite;
  commit_comment: EventPayloads.WebhookPayloadCommitComment;
  "commit_comment.created": EventPayloads.WebhookPayloadCommitComment;
  content_reference: EventPayloads.WebhookPayloadContentReference;
  "content_reference.created": EventPayloads.WebhookPayloadContentReference;
  create: EventPayloads.WebhookPayloadCreate;
  delete: EventPayloads.WebhookPayloadDelete;
  deploy_key: EventPayloads.WebhookPayloadDeployKey;
  "deploy_key.created": EventPayloads.WebhookPayloadDeployKey;
  "deploy_key.deleted": EventPayloads.WebhookPayloadDeployKey;
  deployment: EventPayloads.WebhookPayloadDeployment;
  "deployment.created": EventPayloads.WebhookPayloadDeployment;
  deployment_status: EventPayloads.WebhookPayloadDeploymentStatus;
  "deployment_status.created": EventPayloads.WebhookPayloadDeploymentStatus;
  fork: EventPayloads.WebhookPayloadFork;
  github_app_authorization: EventPayloads.WebhookPayloadGithubAppAuthorization;
  "github_app_authorization.revoked": EventPayloads.WebhookPayloadGithubAppAuthorization;
  gollum: EventPayloads.WebhookPayloadGollum;
  installation: EventPayloads.WebhookPayloadInstallation;
  "installation.created": EventPayloads.WebhookPayloadInstallation;
  "installation.deleted": EventPayloads.WebhookPayloadInstallation;
  "installation.new_permissions_accepted": EventPayloads.WebhookPayloadInstallation;
  "installation.suspend": EventPayloads.WebhookPayloadInstallation;
  "installation.unsuspend": EventPayloads.WebhookPayloadInstallation;
  installation_repositories: EventPayloads.WebhookPayloadInstallationRepositories;
  "installation_repositories.added": EventPayloads.WebhookPayloadInstallationRepositories;
  "installation_repositories.removed": EventPayloads.WebhookPayloadInstallationRepositories;
  issue_comment: EventPayloads.WebhookPayloadIssueComment;
  "issue_comment.created": EventPayloads.WebhookPayloadIssueComment;
  "issue_comment.deleted": EventPayloads.WebhookPayloadIssueComment;
  "issue_comment.edited": EventPayloads.WebhookPayloadIssueComment;
  issues: EventPayloads.WebhookPayloadIssues;
  "issues.assigned": EventPayloads.WebhookPayloadIssues;
  "issues.closed": EventPayloads.WebhookPayloadIssues;
  "issues.deleted": EventPayloads.WebhookPayloadIssues;
  "issues.demilestoned": EventPayloads.WebhookPayloadIssues;
  "issues.edited": EventPayloads.WebhookPayloadIssues;
  "issues.labeled": EventPayloads.WebhookPayloadIssues;
  "issues.locked": EventPayloads.WebhookPayloadIssues;
  "issues.milestoned": EventPayloads.WebhookPayloadIssues;
  "issues.opened": EventPayloads.WebhookPayloadIssues;
  "issues.pinned": EventPayloads.WebhookPayloadIssues;
  "issues.reopened": EventPayloads.WebhookPayloadIssues;
  "issues.transferred": EventPayloads.WebhookPayloadIssues;
  "issues.unassigned": EventPayloads.WebhookPayloadIssues;
  "issues.unlabeled": EventPayloads.WebhookPayloadIssues;
  "issues.unlocked": EventPayloads.WebhookPayloadIssues;
  "issues.unpinned": EventPayloads.WebhookPayloadIssues;
  label: EventPayloads.WebhookPayloadLabel;
  "label.created": EventPayloads.WebhookPayloadLabel;
  "label.deleted": EventPayloads.WebhookPayloadLabel;
  "label.edited": EventPayloads.WebhookPayloadLabel;
  marketplace_purchase: EventPayloads.WebhookPayloadMarketplacePurchase;
  "marketplace_purchase.cancelled": EventPayloads.WebhookPayloadMarketplacePurchase;
  "marketplace_purchase.changed": EventPayloads.WebhookPayloadMarketplacePurchase;
  "marketplace_purchase.pending_change": EventPayloads.WebhookPayloadMarketplacePurchase;
  "marketplace_purchase.pending_change_cancelled": EventPayloads.WebhookPayloadMarketplacePurchase;
  "marketplace_purchase.purchased": EventPayloads.WebhookPayloadMarketplacePurchase;
  member: EventPayloads.WebhookPayloadMember;
  "member.added": EventPayloads.WebhookPayloadMember;
  "member.edited": EventPayloads.WebhookPayloadMember;
  "member.removed": EventPayloads.WebhookPayloadMember;
  membership: EventPayloads.WebhookPayloadMembership;
  "membership.added": EventPayloads.WebhookPayloadMembership;
  "membership.removed": EventPayloads.WebhookPayloadMembership;
  meta: EventPayloads.WebhookPayloadMeta;
  "meta.deleted": EventPayloads.WebhookPayloadMeta;
  milestone: EventPayloads.WebhookPayloadMilestone;
  "milestone.closed": EventPayloads.WebhookPayloadMilestone;
  "milestone.created": EventPayloads.WebhookPayloadMilestone;
  "milestone.deleted": EventPayloads.WebhookPayloadMilestone;
  "milestone.edited": EventPayloads.WebhookPayloadMilestone;
  "milestone.opened": EventPayloads.WebhookPayloadMilestone;
  organization: EventPayloads.WebhookPayloadOrganization;
  "organization.deleted": EventPayloads.WebhookPayloadOrganization;
  "organization.member_added": EventPayloads.WebhookPayloadOrganization;
  "organization.member_invited": EventPayloads.WebhookPayloadOrganization;
  "organization.member_removed": EventPayloads.WebhookPayloadOrganization;
  "organization.renamed": EventPayloads.WebhookPayloadOrganization;
  org_block: EventPayloads.WebhookPayloadOrgBlock;
  "org_block.blocked": EventPayloads.WebhookPayloadOrgBlock;
  "org_block.unblocked": EventPayloads.WebhookPayloadOrgBlock;
  package: EventPayloads.WebhookPayloadPackage;
  "package.published": EventPayloads.WebhookPayloadPackage;
  "package.updated": EventPayloads.WebhookPayloadPackage;
  page_build: EventPayloads.WebhookPayloadPageBuild;
  ping: EventPayloads.WebhookPayloadPing;
  project_card: EventPayloads.WebhookPayloadProjectCard;
  "project_card.converted": EventPayloads.WebhookPayloadProjectCard;
  "project_card.created": EventPayloads.WebhookPayloadProjectCard;
  "project_card.deleted": EventPayloads.WebhookPayloadProjectCard;
  "project_card.edited": EventPayloads.WebhookPayloadProjectCard;
  "project_card.moved": EventPayloads.WebhookPayloadProjectCard;
  project_column: EventPayloads.WebhookPayloadProjectColumn;
  "project_column.created": EventPayloads.WebhookPayloadProjectColumn;
  "project_column.deleted": EventPayloads.WebhookPayloadProjectColumn;
  "project_column.edited": EventPayloads.WebhookPayloadProjectColumn;
  "project_column.moved": EventPayloads.WebhookPayloadProjectColumn;
  project: EventPayloads.WebhookPayloadProject;
  "project.closed": EventPayloads.WebhookPayloadProject;
  "project.created": EventPayloads.WebhookPayloadProject;
  "project.deleted": EventPayloads.WebhookPayloadProject;
  "project.edited": EventPayloads.WebhookPayloadProject;
  "project.reopened": EventPayloads.WebhookPayloadProject;
  public: EventPayloads.WebhookPayloadPublic;
  pull_request: EventPayloads.WebhookPayloadPullRequest;
  "pull_request.assigned": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.closed": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.edited": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.labeled": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.locked": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.merged": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.opened": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.ready_for_review": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.reopened": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.review_request_removed": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.review_requested": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.synchronize": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.unassigned": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.unlabeled": EventPayloads.WebhookPayloadPullRequest;
  "pull_request.unlocked": EventPayloads.WebhookPayloadPullRequest;
  pull_request_review: EventPayloads.WebhookPayloadPullRequestReview;
  "pull_request_review.dismissed": EventPayloads.WebhookPayloadPullRequestReview;
  "pull_request_review.edited": EventPayloads.WebhookPayloadPullRequestReview;
  "pull_request_review.submitted": EventPayloads.WebhookPayloadPullRequestReview;
  pull_request_review_comment: EventPayloads.WebhookPayloadPullRequestReviewComment;
  "pull_request_review_comment.created": EventPayloads.WebhookPayloadPullRequestReviewComment;
  "pull_request_review_comment.deleted": EventPayloads.WebhookPayloadPullRequestReviewComment;
  "pull_request_review_comment.edited": EventPayloads.WebhookPayloadPullRequestReviewComment;
  push: EventPayloads.WebhookPayloadPush;
  release: EventPayloads.WebhookPayloadRelease;
  "release.created": EventPayloads.WebhookPayloadRelease;
  "release.deleted": EventPayloads.WebhookPayloadRelease;
  "release.edited": EventPayloads.WebhookPayloadRelease;
  "release.prereleased": EventPayloads.WebhookPayloadRelease;
  "release.published": EventPayloads.WebhookPayloadRelease;
  "release.released": EventPayloads.WebhookPayloadRelease;
  "release.unpublished": EventPayloads.WebhookPayloadRelease;
  repository_dispatch: EventPayloads.WebhookPayloadRepositoryDispatch;
  "repository_dispatch.on-demand-test": EventPayloads.WebhookPayloadRepositoryDispatch;
  repository: EventPayloads.WebhookPayloadRepository;
  "repository.archived": EventPayloads.WebhookPayloadRepository;
  "repository.created": EventPayloads.WebhookPayloadRepository;
  "repository.deleted": EventPayloads.WebhookPayloadRepository;
  "repository.edited": EventPayloads.WebhookPayloadRepository;
  "repository.privatized": EventPayloads.WebhookPayloadRepository;
  "repository.publicized": EventPayloads.WebhookPayloadRepository;
  "repository.renamed": EventPayloads.WebhookPayloadRepository;
  "repository.transferred": EventPayloads.WebhookPayloadRepository;
  "repository.unarchived": EventPayloads.WebhookPayloadRepository;
  repository_import: EventPayloads.WebhookPayloadRepositoryImport;
  repository_vulnerability_alert: EventPayloads.WebhookPayloadRepositoryVulnerabilityAlert;
  "repository_vulnerability_alert.create": EventPayloads.WebhookPayloadRepositoryVulnerabilityAlert;
  "repository_vulnerability_alert.dismiss": EventPayloads.WebhookPayloadRepositoryVulnerabilityAlert;
  "repository_vulnerability_alert.resolve": EventPayloads.WebhookPayloadRepositoryVulnerabilityAlert;
  security_advisory: EventPayloads.WebhookPayloadSecurityAdvisory;
  "security_advisory.performed": EventPayloads.WebhookPayloadSecurityAdvisory;
  "security_advisory.published": EventPayloads.WebhookPayloadSecurityAdvisory;
  "security_advisory.updated": EventPayloads.WebhookPayloadSecurityAdvisory;
  sponsorship: EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.cancelled": EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.created": EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.edited": EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.pending_cancellation": EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.pending_tier_change": EventPayloads.WebhookPayloadSponsorship;
  "sponsorship.tier_changed": EventPayloads.WebhookPayloadSponsorship;
  star: EventPayloads.WebhookPayloadStar;
  "star.created": EventPayloads.WebhookPayloadStar;
  "star.deleted": EventPayloads.WebhookPayloadStar;
  status: EventPayloads.WebhookPayloadStatus;
  team: EventPayloads.WebhookPayloadTeam;
  "team.added_to_repository": EventPayloads.WebhookPayloadTeam;
  "team.created": EventPayloads.WebhookPayloadTeam;
  "team.deleted": EventPayloads.WebhookPayloadTeam;
  "team.edited": EventPayloads.WebhookPayloadTeam;
  "team.removed_from_repository": EventPayloads.WebhookPayloadTeam;
  team_add: EventPayloads.WebhookPayloadTeamAdd;
  watch: EventPayloads.WebhookPayloadWatch;
  "watch.started": EventPayloads.WebhookPayloadWatch;
  workflow_dispatch: EventPayloads.WebhookPayloadWorkflowDispatch;
  workflow_run: EventPayloads.WebhookPayloadWorkflowRun;
  "workflow_run.action": EventPayloads.WebhookPayloadWorkflowRun;
}
export type All = keyof EventTypesPayload;

export type GetWebhookPayloadTypeFromEvent<
  E extends All
> = EventTypesPayload[E];
