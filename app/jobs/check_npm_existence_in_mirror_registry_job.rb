require 'open3'
class CheckNpmExistenceInMirrorRegistryJob < ApplicationJob
  queue_as :check_npm_existence_in_mirror_registry

  after_perform do |job|
    id = job.arguments.first
    plugin = CiPlugin.find(id)
    if plugin.ci_plugin_log.log['check_existence_of_published_package_in_mirror_registry']['status'] == 0
      puts "plugin #{id} has not been synced yet."
      self.class.set(wait: 5.seconds).perform_later(id)
    else
      puts "exists in mirror."
      SaveConfigurationOnSolarSystemJob.perform_later(id)
    end
  end

  def perform(*args)
	id = args[0]
	plugin = CiPlugin.find(id)
	# registry_url = "http://registry.npm.baidu.com/"
	registry_url = "http://cp01-fis-build-02.epc.baidu.com:8995"
	# registry_url = "https://registry.npm.taobao.org/"
	plugin.ci_plugin_log.log = {} if plugin.ci_plugin_log.log.nil?

	pluginName = "#{plugin.ciPackageNamePrefix}#{plugin.ciPackageName}"
	pluginVersion = "#{plugin.ciPackageVersion}"

	stdout, stderr, status = Open3.capture3("npm v #{pluginName}@#{pluginVersion} dist.tarball --registry=#{registry_url}")
	plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"] = {} if plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"].nil?
	if stdout.length > 0 && plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"]['status'] != 1
	  plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"]['detail'] = "#{stdout}"
	  plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"]['status'] = 1
	else
	  plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"]['detail'] = "#{stderr}"
	  plugin.ci_plugin_log.log["check_existence_of_published_package_in_mirror_registry"]['status'] = 0
	end
	plugin.ci_plugin_log.save!
  end
end
